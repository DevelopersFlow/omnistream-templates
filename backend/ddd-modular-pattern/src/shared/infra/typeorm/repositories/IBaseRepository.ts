import { IQuery } from '@shared/helpers/HttpQueryHelper';

export type IFind = { query?: IQuery; relations?: string[] };
export type IFindById = { id: number; relations?: string[] };
export type IFindByIds = { ids: number[]; relations?: string[] };

export interface IBaseRepository<Entity> {
  create(data: Entity): Promise<Entity>;
  save(entity: Partial<Entity>): Promise<Entity>;
  find(params: IFind): Promise<[Entity[], number]>;
  findById(params: IFindById): Promise<Entity>;
  findByIds(params: IFindByIds): Promise<Entity[]>;
  delete(id: number): Promise<void>;
  remove(id: number): Promise<void>;
}
