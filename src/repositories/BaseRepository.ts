import { Repository, EntityTarget, DataSource, ObjectLiteral,DeepPartial } from 'typeorm';
import { IRepository } from './IRepository';
import { AppDataSource } from '../config/database';

export abstract class BaseRepository<T extends ObjectLiteral> implements IRepository<T> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, dataSource?: DataSource) {
    const source = dataSource || AppDataSource;
    this.repository = source.getRepository(entity);
  }

  async findById(id: string): Promise<T | null> {
    return await this.repository.findOne({ where: { id } as any });
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Entity not found');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  async findByCriteria(criteria: Partial<T>): Promise<T[]> {
    return await this.repository.find({ where: criteria as any });
  }
}