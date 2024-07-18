import { container } from 'tsyringe';

import type { ICredentialsRepository } from './account/credentialsRepository';
import CredentialsRepository from './account/credentialsRepository';
import type { ICredentialsService } from './account/credentialsService';
import CredentialsService from './account/credentialsService';
import type { IGoogleService } from './account/googleService';
import GoogleService from './account/googleService';
import type { IClanRepository } from './clans/clanRepository';
import ClanRepository from './clans/clanRepository';
import type { IClanService } from './clans/clanService';
import ClanService from './clans/clanService';
import type { IClanReportService } from './clans/reports/clanReportService';
import ClanReportService from './clans/reports/clanReportService';
import type { IJobsService } from './jobs/jobsService';
import JobsService from './jobs/jobsService';
import type { IPlayerRepository } from './players/playerRepository';
import PlayerRepository from './players/playerRepository';
import type { IPlayerService } from './players/playerService';
import PlayerService from './players/playerService';
import type { ISessionRepository } from './sessions/sessionRepository';
import SessionRepository from './sessions/sessionRepository';
import type { ISessionService } from './sessions/sessionService';
import SessionService from './sessions/sessionService';
import type { IUserRepository } from './users/userRepository';
import UserRepository from './users/userRepository';
import type { IUserService } from './users/userService';
import UserService from './users/userService';

container
  // repositories
  .register<IClanRepository>('ClanRepository', { useClass: ClanRepository })
  .register<ICredentialsRepository>('CredentialsRepository', {
    useClass: CredentialsRepository,
  })
  .register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
  })
  .register<ISessionRepository>('SessionRepository', {
    useClass: SessionRepository,
  })
  .register<IUserRepository>('UserRepository', { useClass: UserRepository })
  // services
  .register<ICredentialsService>('CredentialsService', {
    useClass: CredentialsService,
  })
  .register<IClanService>('ClanService', { useClass: ClanService })
  .register<IClanReportService>('ClanReportService', {
    useClass: ClanReportService,
  })
  .register<IGoogleService>('GoogleService', { useClass: GoogleService })
  .registerSingleton<IJobsService>('JobsService', JobsService)
  .register<IPlayerService>('PlayerService', { useClass: PlayerService })
  .register<ISessionService>('SessionService', { useClass: SessionService })
  .register<IUserService>('UserService', { useClass: UserService });

export default container;
