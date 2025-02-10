import { container } from 'tsyringe';
import type { DataSource } from 'typeorm';

import ConfigService from './config';
import db from './db';
import SeedingService from './db/seeding/seedingService';
import type { IJobsService } from './jobs/jobsService';
import JobsService from './jobs/jobsService';
import WiseOldManServiceMock from './mocks/wiseOldManServiceMock';
import type { IGoogleService } from './services/googleService';
import GoogleService from './services/googleService';
import WiseOldManService, {
  type IWiseOldManService,
} from './services/wiseOldManService';

container
  .registerSingleton<ConfigService>('ConfigService', ConfigService)
  .registerInstance<DataSource>('DataSource', db)
  .register<SeedingService>('SeedingService', { useClass: SeedingService })
  .register<IGoogleService>('GoogleService', { useClass: GoogleService })
  .registerSingleton<IJobsService>('JobsService', JobsService);

const isTest = container.resolve<ConfigService>('ConfigService').isTest;
const WiseOldManServiceClass = isTest
  ? WiseOldManServiceMock
  : WiseOldManService;

container.registerSingleton<IWiseOldManService>(
  'WiseOldManService',
  WiseOldManServiceClass,
);

export default container;
