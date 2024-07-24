import { container } from 'tsyringe';

import ConfigService from './config';
import type { IJobsService } from './jobs/jobsService';
import JobsService from './jobs/jobsService';
import type { IGoogleService } from './services/googleService';
import GoogleService from './services/googleService';

container
  .register<ConfigService>('ConfigService', { useClass: ConfigService })
  .register<IGoogleService>('GoogleService', { useClass: GoogleService })
  .registerSingleton<IJobsService>('JobsService', JobsService);

export default container;
