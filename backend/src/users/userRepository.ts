import { injectable } from 'tsyringe';

import type { UserRelations } from './user';
import User from './user';
import db from '../db';

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null>;
  getUserByGoogleId(googleId: string): Promise<User | null>;
  getUserById(id: number, relations?: UserRelations[]): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  saveUser(user: User): Promise<User>;
}

@injectable()
export default class UserRepository implements IUserRepository {
  private readonly userRepository = db.getRepository(User);

  public async getUserByEmail(email: string) {
    const emailNormalized = User.normalizeEmail(email);
    return this.userRepository.findOneBy({ emailNormalized });
  }

  public async getUserByGoogleId(googleId: string) {
    return this.userRepository.findOneBy({ googleId });
  }

  public async getUserById(id: number, relations: UserRelations[]) {
    return this.userRepository.findOne({ where: { id }, relations });
  }

  public async getUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  public async saveUser(user: User) {
    return this.userRepository.save(user);
  }
}
