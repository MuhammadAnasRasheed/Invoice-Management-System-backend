import { BaseRepository } from './BaseRepository';
import { User } from '../entities/User';
import { AppDataSource } from '../config/database';

export class UserRepository extends BaseRepository<User> {
  private static instance: UserRepository;

  private constructor() {
    super(User);
  }

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findByCriteria({ email } as Partial<User>);
    return users[0] || null;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
}