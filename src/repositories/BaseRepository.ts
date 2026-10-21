import { Repository, EntityTarget, DataSource, ObjectLiteral, DeepPartial } from 'typeorm';
import { IRepository } from './IRepository';
import { AppDataSource } from '../config/database';

export abstract class BaseRepository<T extends ObjectLiteral> implements IRepository<T> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, dataSource?: DataSource) {
    const source = dataSource || AppDataSource;
    this.repository = source.getRepository(entity);
  }

  async findById(id: number | string): Promise<T | null> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    return await this.repository.findOne({ where: { id: numericId } as any });
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id: number | string, data: Partial<T>): Promise<T> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    await this.repository.update(numericId, data as any);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Entity not found');
    return updated;
  }

  async delete(id: number | string): Promise<boolean> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const result = await this.repository.delete(numericId);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  async findByCriteria(criteria: Partial<T>): Promise<T[]> {
    return await this.repository.find({ where: criteria as any });
  }
}

