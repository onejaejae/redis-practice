# NestJS + Winston-Loki + Grafana 로그 모니터링 시스템 구축 가이드

## 목차
1. [개요](#개요)
2. [Loki와 Grafana 소개](#loki와-grafana-소개)
3. [시스템 구성도](#시스템-구성도)
4. [사전 준비사항](#사전-준비사항)
5. [Loki 설치 및 설정](#loki-설치-및-설정)
6. [NestJS Winston-Loki 연동](#nestjs-winston-loki-연동)
7. [Grafana 설치 및 설정](#grafana-설치-및-설정)
8. [Loki 데이터소스 추가](#loki-데이터소스-추가)
9. [대시보드 설정](#대시보드-설정)
10. [로그 조회 및 모니터링](#로그-조회-및-모니터링)
11. [트러블슈팅](#트러블슈팅)

## 개요

이 가이드는 NestJS 애플리케이션에서 Winston-Loki를 사용하여 로그를 Loki로 전송하고, Grafana를 통해 시각화하는 로그 모니터링 시스템을 구축하는 방법을 설명합니다.

**대상 독자**: Loki, Grafana를 처음 사용하는 백엔드 개발자

## Loki와 Grafana 소개

### Loki란?
- **Grafana Labs**에서 개발한 오픈소스 로그 집계 시스템
- Prometheus와 유사한 구조로 로그 데이터를 저장하고 쿼리
- 메타데이터(레이블)를 기반으로 로그를 인덱싱하여 높은 성능과 낮은 비용으로 운영 가능
- 수평 확장 가능하며 클라우드 네이티브 환경에 최적화

### Grafana란?
- 메트릭, 로그, 트레이스를 시각화하는 오픈소스 관측 가능성 플랫폼
- 다양한 데이터소스(Prometheus, Loki, Elasticsearch 등)를 지원
- 대시보드를 통한 실시간 모니터링 및 알림 기능 제공
- 사용자 친화적인 웹 인터페이스

## 시스템 구성도

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   NestJS    │───▶│     Loki     │───▶│   Grafana   │
│ Application │    │   (로그저장)   │    │  (시각화)    │
│             │    │              │    │             │
│ Winston +   │    │              │    │             │
│ winston-loki│    │              │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
```

## 사전 준비사항

- Docker 및 Docker Compose 설치
- NestJS 프로젝트 준비
- 기본적인 터미널 명령어 사용법

## Loki 설치 및 설정

### 1. Docker Compose로 Loki 설치

프로젝트 루트에 `docker-compose.yml` 파일을 생성합니다:

```yaml
version: '3.8'

services:
  loki:
    image: grafana/loki:2.9.0
    ports:
      - "3100:3100"
    volumes:
      - ./monitoring/loki:/etc/loki
    command: -config.file=/etc/loki/loki-config.yml
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana
    networks:
      - monitoring

volumes:
  grafana-storage:

networks:
  monitoring:
    driver: bridge
```

### 2. Loki 설정 파일 생성

`monitoring/loki/loki-config.yml` 파일을 생성합니다:

```yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

query_scheduler:
  max_outstanding_requests_per_tenant: 2048

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

analytics:
  reporting_enabled: false
```

### 3. 서비스 실행

```bash
# 디렉토리 생성
mkdir -p monitoring/loki

# 설정 파일 생성 후 Docker Compose 실행
docker-compose up -d

# 서비스 상태 확인
docker-compose ps
```

## NestJS Winston-Loki 연동

### 1. 필요한 패키지 설치

```bash
npm install winston winston-loki @nestjs/common
npm install --save-dev @types/winston
```

### 2. Winston 모듈 설정

`src/core/logger/winston.config.ts` 파일을 생성합니다:

```typescript
import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';

const { combine, timestamp, errors, json, printf } = format;

export const createWinstonLogger = () => {
  const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      stack,
      ...meta,
    });
  });

  return createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
      timestamp(),
      errors({ stack: true }),
      json(),
      logFormat
    ),
    transports: [
      // 콘솔 출력
      new transports.Console({
        format: combine(
          timestamp(),
          format.colorize(),
          format.simple()
        ),
      }),
      
      // Loki로 전송
      new LokiTransport({
        host: process.env.LOKI_HOST || 'http://localhost:3100',
        labels: {
          app: 'nestjs-app',
          environment: process.env.NODE_ENV || 'development',
        },
        json: true,
        format: json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error('Loki connection error:', err),
      }),
    ],
  });
};
```

### 3. Logger 모듈 생성

`src/core/logger/logger.module.ts`:

```typescript
import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
```

### 4. Logger 서비스 생성

`src/core/logger/logger.service.ts`:

```typescript
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import { createWinstonLogger } from './winston.config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createWinstonLogger();
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // 구조화된 로그를 위한 추가 메서드
  logWithData(level: string, message: string, data: any, context?: string) {
    this.logger.log(level, message, { ...data, context });
  }
}
```

### 5. App 모듈에 Logger 등록

`src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { LoggerModule } from './core/logger/logger.module';
// ... 다른 imports

@Module({
  imports: [
    LoggerModule,
    // ... 다른 모듈들
  ],
  // ...
})
export class AppModule {}
```

### 6. 서비스에서 Logger 사용

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../core/logger/logger.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  async createUser(userData: any) {
    try {
      this.logger.log('Creating new user', 'UserService');
      
      // 비즈니스 로직...
      
      this.logger.logWithData('info', 'User created successfully', {
        userId: user.id,
        email: user.email
      }, 'UserService');
      
      return user;
    } catch (error) {
      this.logger.error(
        'Failed to create user',
        error.stack,
        'UserService'
      );
      throw error;
    }
  }
}
```

## Grafana 설치 및 설정

### 1. Grafana 접속

브라우저에서 `http://localhost:3000`으로 접속합니다.

- 기본 계정: `admin`
- 기본 비밀번호: `admin`

최초 로그인 시 비밀번호 변경을 요구합니다.

### 2. Loki 플러그인 확인

Grafana에는 Loki 데이터소스가 기본으로 포함되어 있습니다.

## Loki 데이터소스 추가

### 1. 데이터소스 메뉴 접근

1. 왼쪽 사이드바에서 **Configuration (톱니바퀴 아이콘)** 클릭
2. **Data Sources** 선택
3. **Add data source** 버튼 클릭

### 2. Loki 데이터소스 설정

1. **Loki** 선택
2. 다음과 같이 설정:
   - **Name**: `Loki`
   - **URL**: `http://loki:3100` (Docker 환경) 또는 `http://localhost:3100` (로컬 환경)
3. **Save & Test** 버튼 클릭

설정이 올바르면 "Data source connected and labels found." 메시지가 표시됩니다.

## 대시보드 설정

### 1. 기본 대시보드 JSON 예시

다음은 로그 모니터링을 위한 기본 대시보드 JSON 예시입니다:

```json
{
  "dashboard": {
    "id": null,
    "title": "NestJS Application Logs",
    "tags": ["nestjs", "logs"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Log Volume",
        "type": "stat",
        "targets": [
          {
            "datasource": {
              "type": "loki",
              "uid": "YOUR_LOKI_UID_HERE"
            },
            "expr": "sum(count_over_time({app=\"nestjs-app\"}[5m]))",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "palette-classic"
            },
            "custom": {
              "hideFrom": {
                "legend": false,
                "tooltip": false,
                "vis": false
              }
            }
          }
        },
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 0,
          "y": 0
        }
      },
      {
        "id": 2,
        "title": "Recent Logs",
        "type": "logs",
        "targets": [
          {
            "datasource": {
              "type": "loki",
              "uid": "YOUR_LOKI_UID_HERE"
            },
            "expr": "{app=\"nestjs-app\"} |= \"\"",
            "refId": "A"
          }
        ],
        "gridPos": {
          "h": 12,
          "w": 24,
          "x": 0,
          "y": 8
        }
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "5s"
  }
}
```

### 2. 대시보드 임포트 방법

#### 2-1. Loki UID 확인
1. Grafana에서 **Configuration** → **Data Sources** → **Loki** 클릭
2. URL 끝의 UID 확인 (예: `/datasources/edit/abc123def`)

#### 2-2. 대시보드 임포트
1. 왼쪽 사이드바에서 **+ (Create)** → **Import** 클릭
2. **Import via dashboard JSON model** 선택
3. 위의 JSON을 복사하여 붙여넣기
4. `YOUR_LOKI_UID_HERE`를 실제 Loki UID로 변경
5. **Title** 설정 (예: "NestJS Application Logs")
6. **Change UID** 버튼 클릭하여 고유 UID 생성
7. **Import** 버튼 클릭

## 로그 조회 및 모니터링

### 1. Explore 탭에서 로그 조회

#### 1-1. Explore 접근
1. 왼쪽 사이드바에서 **Explore (나침반 아이콘)** 클릭
2. 상단에서 데이터소스를 **Loki**로 선택

#### 1-2. 로그 쿼리 예시

**기본 쿼리**:
```
{app="nestjs-app"}
```

**특정 레벨 로그 조회**:
```
{app="nestjs-app"} |= "error"
```

**컨텍스트별 로그 조회**:
```
{app="nestjs-app"} | json | context="UserService"
```

**시간 범위 내 에러 로그**:
```
{app="nestjs-app"} |= "ERROR" | json | line_format "{{.timestamp}} {{.level}} {{.message}}"
```

### 2. 유용한 LogQL 쿼리 패턴

```bash
# 특정 사용자 ID 관련 로그
{app="nestjs-app"} | json | userId="12345"

# HTTP 요청 로그 필터링
{app="nestjs-app"} |= "HTTP" | json | method="POST"

# 응답 시간이 긴 요청
{app="nestjs-app"} | json | responseTime > 1000

# 에러 로그 카운트
sum(count_over_time({app="nestjs-app"} |= "ERROR" [5m]))
```

### 3. 알림 설정

대시보드에서 특정 조건(예: 에러 로그 급증)에 대한 알림을 설정할 수 있습니다:

1. 패널 편집 → **Alert** 탭
2. 알림 조건 설정
3. 알림 채널 연결 (Slack, Email 등)

## 트러블슈팅

### 1. Loki 연결 문제

**증상**: Grafana에서 Loki 데이터소스 연결 실패

**해결방법**:
```bash
# Loki 서비스 상태 확인
docker-compose logs loki

# Loki API 직접 테스트
curl http://localhost:3100/ready

# 네트워크 확인
docker network ls
docker network inspect redis-practice_monitoring
```

### 2. 로그가 Loki에 전송되지 않는 경우

**확인사항**:
1. winston-loki 설정의 host URL 확인
2. 네트워크 연결 상태 확인
3. Loki 로그에서 에러 메시지 확인

```bash
# 애플리케이션 로그 확인
npm run start:dev

# Loki로 수동 로그 전송 테스트
curl -v -H "Content-Type: application/json" \
  -X POST \
  -d '{"streams":[{"stream":{"app":"test"},"values":[["'$(date +%s%N)'","test message"]]}]}' \
  http://localhost:3100/loki/api/v1/push
```

### 3. 대시보드에 데이터가 표시되지 않는 경우

**확인사항**:
1. 시간 범위 설정 확인
2. 로그 레이블이 올바른지 확인
3. Explore에서 직접 쿼리 테스트

```bash
# Loki에 저장된 레이블 확인
curl http://localhost:3100/loki/api/v1/labels
```

### 4. 성능 최적화

**대용량 로그 처리를 위한 설정**:

```yaml
# loki-config.yml에 추가
limits_config:
  ingestion_rate_mb: 16
  ingestion_burst_size_mb: 32
  max_streams_per_user: 10000
  max_line_size: 256000
```

### 5. 로그 보존 정책 설정

```yaml
# loki-config.yml에 추가
table_manager:
  retention_deletes_enabled: true
  retention_period: 168h  # 7일
```

## 결론

이제 NestJS 애플리케이션의 로그를 Loki로 수집하고 Grafana로 시각화하는 완전한 모니터링 시스템이 구축되었습니다. 이 시스템을 통해:

- 실시간 로그 모니터링
- 구조화된 로그 검색 및 필터링
- 사용자 정의 대시보드를 통한 시각화
- 알림 기능을 통한 이슈 대응

추가적으로 프로덕션 환경에서는 로그 볼륨과 보존 정책을 고려하여 적절한 스토리지 및 성능 튜닝을 수행하시기 바랍니다.