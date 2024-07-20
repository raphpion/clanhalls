import { container } from 'tsyringe';

import type { IJobsService } from './jobs/jobsService';
import JobsService from './jobs/jobsService';
import type { IGoogleService } from './services/googleService';
import GoogleService from './services/googleService';

container
  .register<IGoogleService>('GoogleService', { useClass: GoogleService })
  .registerSingleton<IJobsService>('JobsService', JobsService);

export default container;
