import { DeepPartial, Repository, SelectQueryBuilder, In, ObjectLiteral } from 'typeorm';

import { operators } from '@shared/helpers/HttpQueryHelper';

import {
  IBaseRepository,
  IFind,
  IFindById,
  IFindByIds,
} from './IBaseRepository';

class BaseRepository<Entity extends ObjectLiteral> implements IBaseRepository<Entity> {
  protected orm: Repository<Entity>;

  private operators = operators;

  constructor(orm: Repository<Entity>) {
    this.orm = orm;
  }

  private snakeToPascal(string: string): string {
    return string
      .split('/')
      .map((snake) =>
        snake
          .split('_')
          .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
          .join(''),
      )
      .join('/');
  }

  private getAlias(entity: string): string {
    const { targetName } = this.orm.metadata;

    const parsedEntity = entity
      .split(/\.?(?=[A-Z])/)
      .join('_')
      .toLowerCase();

    const parsedTargetName = targetName
      .split(/\.?(?=[A-Z])/)
      .join('_')
      .toLowerCase();

    if (parsedEntity === parsedTargetName) {
      return this.snakeToPascal(parsedEntity);
    }

    return `${targetName}__${entity}`;
  }

  private bind({ query, relations }: IFind) {
    const order: any = {};

    query?.sort?.forEach((item) => {
      order[item.property] = item.order;
    });

    const rules = {
      AND: (qb: SelectQueryBuilder<Entity>, whereQuery: string) => {
        qb.andWhere(whereQuery);
      },
      OR: (qb: SelectQueryBuilder<Entity>, whereQuery: string) => {
        qb.orWhere(whereQuery);
      },
    };

    const where = (qb: SelectQueryBuilder<Entity>) => {
      query?.q?.forEach((item) => {
        const parsedEntity = this.getAlias(item.entity);

        const property = `${parsedEntity}.${item.property}`;
        const operator = this.operators[item.operator];

        const value =
          item.operator === 'LIKE' ? `'%${item.value}%'` : `'${item.value}'`;

        if (item.operator === 'IS_NULL' || item.operator === 'IS_NOT_NULL') {
          rules[item.rule](qb, `${property} ${operators[item.operator]}`);
        } else {
          rules[item.rule](qb, `${property} ${operator} ${value}`);
        }
      });
    };

    return {
      relations,
      take: query?.limit,
      skip: ((query?.page ?? 0) - 1) * (query?.limit ?? 1),
      order,
      where,
    };
  }

  public async create(data: Entity): Promise<Entity> {
    const entity = this.orm.create(data as DeepPartial<Entity>);

    await this.orm.save<DeepPartial<Entity>>(entity as DeepPartial<Entity>);

    return entity;
  }

  public async save(entity: Entity): Promise<Entity> {
    await this.orm.save(entity as DeepPartial<Entity>);

    return entity;
  }

  public async find({
    query,
    relations = [],
  }: IFind): Promise<[Entity[], number]> {
    const total = await this.orm.count(this.bind({ query, relations }));

    const entities = await this.orm.find(this.bind({ query, relations }));

    return [entities, total];
  }

  public async findById({ id, relations = [] }: IFindById): Promise<Entity | undefined> {
    const entity = await this.orm.findOne(id, { relations });

    return entity;
  }

  public async findByIds({ ids, relations }: IFindByIds): Promise<Entity[]> {
    const entities = await this.orm.find({
      where: { id: In(ids) },
      relations,
    });

    return entities;
  }

  public async delete(id: number): Promise<void> {
    await this.orm.softDelete(id);
  }

  public async remove(id: number): Promise<void> {
    await this.orm.delete(id);
  }
}

export { BaseRepository };
