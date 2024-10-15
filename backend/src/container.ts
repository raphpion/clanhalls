import { container } from 'tsyringe';
import type { DataSource } from 'typeorm';

import ConfigService from './config';
import db from './db';
import type { IJobsService } from './jobs/jobsService';
import JobsService from './jobs/jobsService';
import dbMock from './mocks/dbMock';
import WiseOldManServiceMock from './mocks/wiseOldManServiceMock';
import type { IGoogleService } from './services/googleService';
import GoogleService from './services/googleService';
import WiseOldManService, {
  type IWiseOldManService,
} from './services/wiseOldManService';

container
  .register<ConfigService>('ConfigService', { useClass: ConfigService })
  .register<IGoogleService>('GoogleService', { useClass: GoogleService })
  .registerSingleton<IJobsService>('JobsService', JobsService);

const isTest = container.resolve<ConfigService>('ConfigService').isTest;
const dataSource = isTest ? dbMock : db;
const WiseOldManServiceClass = isTest
  ? WiseOldManServiceMock
  : WiseOldManService;

container
  .register<DataSource>('DataSource', { useValue: dataSource })
  .register<IWiseOldManService>('WiseOldManService', {
    useClass: WiseOldManServiceClass,
  });

export default container;
