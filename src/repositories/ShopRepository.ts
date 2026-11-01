import { BaseRepository } from './BaseRepository';
import { Shop } from '../entities/Shops';
import { ILike } from 'typeorm';

export class ShopRepository extends BaseRepository<Shop> {
  private static instance: ShopRepository;

  private constructor() {
    super(Shop);
  }

  static getInstance(): ShopRepository {
    if (!ShopRepository.instance) {
      ShopRepository.instance = new ShopRepository();
    }
    return ShopRepository.instance;
  }

  async findByOwner(userId: number | string, search?: string): Promise<Shop[]> {
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;

    if (search && search.trim() !== '') {
      return await this.repository.find({
        where: {
          owner: { id: numericUserId },
          name: ILike(`%${search}%`)
        },
        order: { createdAt: 'DESC' }
      });
    }

    return await this.repository.find({
      where: {
        owner: { id: numericUserId }
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findByIdWithOwner(id: number | string): Promise<Shop | null> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    return await this.repository.findOne({
      where: { id: numericId } as any,
      relations: ['owner']
    });
  }

  async softDeleteShop(id: number | string, userId: number | string): Promise<boolean> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;

    const result = await this.repository.update(numericId, {
      deletedAt: new Date(),
      deletedBy: numericUserId
    } as any);

    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
}

