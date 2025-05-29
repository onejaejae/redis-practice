import { NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import { UuidEntity } from './base.entity';
import { OmitNotJoinedProps, OmitUppercaseProps } from './typeorm.interface';

export class GenericTypeOrmRepository<
  T extends UuidEntity,
> extends Repository<T> {
  constructor(
    target: EntityTarget<T>,
    manager: EntityManager,
    queryRunner: QueryRunner,
  ) {
    super(target, manager, queryRunner);
  }

  async findOneWithOmitNotJoinedProps<R extends FindOptionsRelations<T>>(
    filters: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    findOptionsRelations: R,
    orderOptions?: FindOptionsOrder<T>,
    withDeleted?: boolean,
  ): Promise<OmitNotJoinedProps<T, R> | null> {
    const findOption: FindOneOptions = {
      where: filters,
      relations: findOptionsRelations,
      order: orderOptions,
      withDeleted,
    };
    const res = await this.findOne(findOption);
    return res as OmitNotJoinedProps<T, R> | null;
  }

  async findOneWithOmitNotJoinedPropsOrThrow<R extends FindOptionsRelations<T>>(
    filters: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    findOptionsRelations: R,
    orderOptions?: FindOptionsOrder<T>,
    withDeleted?: boolean,
  ): Promise<OmitNotJoinedProps<T, R>> {
    const findOption: FindOneOptions = {
      where: filters,
      relations: findOptionsRelations,
      order: orderOptions,
      withDeleted,
    };
    const res = await this.findOne(findOption);

    if (!res) {
      throw new NotFoundException('Not found');
    }

    return res as OmitNotJoinedProps<T, R>;
  }

  async findManyWithOmitNotJoinedProps<
    R extends FindOptionsRelations<T> = FindOptionsRelations<T>,
  >(
    filters: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    findOptionsRelations: R,
    orderOptions?: FindOptionsOrder<T>,
    withDeleted?: boolean,
  ): Promise<Array<OmitNotJoinedProps<T, R>>> {
    const findOption: FindManyOptions = {
      where: filters,
      relations: findOptionsRelations,
      order: orderOptions,
      withDeleted,
    };
    const res = await this.find(findOption);
    return res as Array<OmitNotJoinedProps<T, R>>;
  }

  async findOneByFilters(
    filters: FindOptionsWhere<T>,
    orderOptions?: FindOptionsOrder<T>,
  ): Promise<OmitUppercaseProps<T> | null> {
    const findOption: FindOneOptions = {
      where: filters,
      order: orderOptions,
    };

    const res = await this.findOne(findOption);
    return res;
  }

  async findAll(): Promise<OmitUppercaseProps<T[]>> {
    const res = await this.find();
    return res;
  }

  async findMany(
    filters: FindOptionsWhere<T>,
    orderOptions?: FindOptionsOrder<T>,
  ): Promise<OmitUppercaseProps<T[]>> {
    const findOption: FindManyOptions = {
      where: filters,
      order: orderOptions,
    };
    const res = await this.find(findOption);
    return res;
  }

  async findOneOrThrow(
    filters: Partial<T>,
    orderOptions?: FindOptionsOrder<T>,
  ): Promise<OmitUppercaseProps<T>> {
    const findOption: FindOneOptions = {
      where: filters,
      order: orderOptions,
    };
    const res = await this.findOne(findOption);

    if (!res) {
      const msgList: string[] = [];
      for (const [key, value] of Object.entries(filters)) {
        msgList.push(`${key}: ${value}`);
      }
      throw new NotFoundException(`don't exist ${msgList.join(', ')}`);
    }
    return res;
  }

  async findByIdOrThrow(id: string): Promise<OmitUppercaseProps<T>> {
    const findOption: FindOneOptions = { where: { id } };
    const res = await this.findOne(findOption);

    if (!res) {
      throw new NotFoundException(`don't exist ${id}`);
    }
    return res;
  }

  async deleteAllForTest() {
    await this.delete({});
  }
}
