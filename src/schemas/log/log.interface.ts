import { Union } from 'src/common/type/common.interface';

export const LogLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  TRACE: 'TRACE',
} as const;
export type LogLevels = Union<typeof LogLevels>;
