import { ShopRepository } from '../repositories/ShopRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Shop } from '../entities/Shops';
import { date } from 'zod';

export class ShopService {
  private shopRepository: ShopRepository;
  private userRepository: UserRepository;

  constructor() {
    this.shopRepository = ShopRepository.getInstance();
    this.userRepository = UserRepository.getInstance();
  }

  async createShop(data: {
    name: string;
    address: string;
    city: string;
    country: string;
  }, userId: number | string): Promise<Shop> {
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;

    const user = await this.userRepository.findById(numericUserId);
    if (!user) {
      throw new Error('User not found');
    }

    const shop = await this.shopRepository.create({
      name: data.name,
      address: data.address,
      city: data.city,
      country: data.country,
      owner: user,
      createdBy: numericUserId,
      updatedBy: null,
      deletedBy: null,
      updatedAt:null
    } as any);

    return shop;
  }

  async getAllShops(userId: number | string, search?: string): Promise<Shop[]> {
    return await this.shopRepository.findByOwner(userId, search);
  }

  async getShopById(id: number | string, userId: number | string): Promise<Shop | null> {
    const shop = await this.shopRepository.findByIdWithOwner(id);
    if (!shop || Number(shop.owner.id) !== Number(userId)) {
      return null;
    }
    return shop;
  }

  async updateShop(id: number | string, data: Partial<Shop>, userId: number | string): Promise<Shop | null> {
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;
    const shop = await this.getShopById(id, userId);
    if (!shop) return null;

    // Remove owner, createdBy, etc. to prevent ownership change
    const { owner, createdBy, createdAt, deletedAt, deletedBy, ...cleanData } = data as any;
    return await this.shopRepository.update(id, {
      ...cleanData,
      updatedBy: numericUserId,
      updatedAt:new Date()
    });
  }

  async deleteShop(id: number | string, userId: number | string): Promise<boolean> {
    try {
      const numericId = typeof id === 'string' ? Number(id) : id;
      const shop = await this.getShopById(numericId, userId);
      if (!shop) return false;

      return await this.shopRepository.softDeleteShop(numericId, userId);
    } catch (error) {
      console.error('Delete shop error:', error);
      return false;
    }
  }
}

