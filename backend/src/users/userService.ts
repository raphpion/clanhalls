import { inject, injectable } from 'tsyringe';

import User from './user';
import type { IUserRepository } from './userRepository';

export interface IUserService {
  createUser(
    googleId: string,
    email: string,
    emailVerified: boolean
  ): Promise<User>;

  getUserByGoogleId(googleId: string): Promise<User | null>;

  getUserByUsername(username: string): Promise<User | null>;

  setUsername(user: User, username: string): Promise<void>;

  verifyEmail(user: User): Promise<void>;
}

@injectable()
class UserService implements IUserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) {}

  async createUser(googleId: string, email: string, emailVerified: boolean) {
    const user = new User();
    user.googleId = googleId;
    user.changeEmail(email);
    user.emailVerified = emailVerified;

    return this.userRepository.saveUser(user);
  }

  async getUserByGoogleId(googleId: string) {
    return this.userRepository.getUserByGoogleId(googleId);
  }

  async getUserByUsername(username: string) {
    return this.userRepository.getUserByUsername(username);
  }

  async setUsername(user: User, username: string) {
    user.setUsername(username);
    await this.userRepository.saveUser(user);
  }

  async verifyEmail(user: User) {
    user.verifyEmail();
    await this.userRepository.saveUser(user);
  }
}

export default UserService;
