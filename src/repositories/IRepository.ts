import { DeepPartial } from "typeorm";

export interface IRepository<T> {
  findById(id: number | string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: number | string, data: Partial<T>): Promise<T>;
  delete(id: number | string): Promise<boolean>;
  findByCriteria(criteria: Partial<T>): Promise<T[]>;
}
