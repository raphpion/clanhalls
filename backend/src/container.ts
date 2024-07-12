import { container } from 'tsyringe';

import type { ICredentialsRepository } from './account/credentialsRepository';
import CredentialsRepository from './account/credentialsRepository';
import type { ICredentialsService } from './account/credentialsService';
import CredentialsService from './account/credentialsService';
import GoogleService, { type IGoogleService } from './account/googleService';
import type { IClanRepository } from './clans/clanRepository';
import ClanRepository from './clans/clanRepository';
import type { IClanService } from './clans/clanService';
import ClanService from './clans/clanService';
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
  .register<IClanRepository>('ClanRepository', { useClass: ClanRepository })
  .register<ICredentialsRepository>('CredentialsRepository', {
    useClass: CredentialsRepository,
  })
  .register<ISessionRepository>('SessionRepository', {
    useClass: SessionRepository,
  })
  .register<ICredentialsService>('CredentialsService', {
    useClass: CredentialsService,
  })
  .register<IGoogleService>('GoogleService', { useClass: GoogleService })
  .register<IUserRepository>('UserRepository', { useClass: UserRepository })
  .register<IClanService>('ClanService', { useClass: ClanService })
  .register<ISessionService>('SessionService', { useClass: SessionService })
  .register<IUserService>('UserService', { useClass: UserService });

export default container;
