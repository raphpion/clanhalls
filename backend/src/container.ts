import { container } from 'tsyringe';

import GoogleService, { type IGoogleService } from './account/googleService';
import SessionRepository, {
  type ISessionRepository,
} from './sessions/sessionRepository';
import SessionService, {
  type ISessionService,
} from './sessions/sessionService';
import type { IUserRepository } from './users/userRepository';
import UserRepository from './users/userRepository';
import type { IUserService } from './users/userService';
import UserService from './users/userService';

container
  .register<ISessionRepository>('SessionRepository', {
    useClass: SessionRepository,
  })
  .register<IUserRepository>('UserRepository', { useClass: UserRepository })
  .register<ISessionService>('SessionService', { useClass: SessionService })
  .register<IUserService>('UserService', { useClass: UserService })
  .register<IGoogleService>('GoogleService', { useClass: GoogleService });

export default container;
