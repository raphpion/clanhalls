import { container } from 'tsyringe';
import type { DataSource } from 'typeorm';

import ConfigService from './config';
import db from './db';
import testDb from './db/testDb';
import type { IJobsService } from './jobs/jobsService';
import JobsService from './jobs/jobsService';
import type { IGoogleService } from './services/googleService';
import GoogleService from './services/googleService';

container
  .register<ConfigService>('ConfigService', { useClass: ConfigService })
  .register<IGoogleService>('GoogleService', { useClass: GoogleService })
  .registerSingleton<IJobsService>('JobsService', JobsService);

const isTest = container.resolve<ConfigService>('ConfigService').isTest;
const dataSource = isTest ? testDb : db;

container.register<DataSource>('DataSource', { useValue: dataSource });

export default container;
