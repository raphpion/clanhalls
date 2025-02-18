import { type Job as BullMQJob, Queue, Worker } from 'bullmq';
import { inject, singleton } from 'tsyringe';

import ApplyMemberActivityReportDataJob from './clans/reports/applyMemberActivityReportDataJob';
import ApplyMembersListReportDataJob from './clans/reports/applyMembersListReportDataJob';
import ApplyPendingClanReportsDataJob from './clans/reports/applyPendingClanReportsDataJob';
import ApplySettingsReportDataJob from './clans/reports/applySettingsReportDataJob';
import type { JobClass } from './job';
import type Job from './job';
import AssociatePlayerToWiseOldManJob from './players/associatePlayerToWiseOldManJob';
import type ConfigService from '../config';
import type { ILoggerService } from '../services/loggerService';

export interface IJobsService {
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  add<T>(job: JobClass<T>, payload?: T): Promise<unknown>;
}

export type CronJob = {
  interval: string;
  job: JobClass<unknown>;
};

const PREFIX = 'jobs';

const JOBS = [
  ApplyMemberActivityReportDataJob,
  ApplyMembersListReportDataJob,
  ApplyPendingClanReportsDataJob,
  ApplySettingsReportDataJob,
  AssociatePlayerToWiseOldManJob,
] as JobClass<unknown>[];

const CRON_JOBS: CronJob[] = [
  // every day at 00:00
  { job: ApplyPendingClanReportsDataJob, interval: '0 0 * * *' },
];

const STARTUP_JOBS: JobClass<unknown>[] = [];

const LOGGER_NAME = 'JobsService';

@singleton()
class JobsService implements IJobsService {
  private queues: Queue[];
  private workers: Worker[];

  constructor(
    @inject('ConfigService') private readonly configService: ConfigService,
    @inject('LoggerService') private readonly loggerService: ILoggerService,
  ) {
    this.queues = [];
    this.workers = [];
  }

  async add<T>(job: JobClass<T>, payload?: T) {
    this.loggerService.logService(
      'info',
      LOGGER_NAME,
      `Adding job of type ${job.name}`,
    );
    const queue = this.queues.find((queue) => queue.name === job.name);
    if (!queue) {
      throw new Error(`Implementation queue for job ${job.name} not found`);
    }

    const task = await queue.add(job.name, payload);
    return task;
  }

  async initialize() {
    for (const job of JOBS) {
      const jobInstance = new job();

      const connection = {
        host: process.env.REDIS_URL!,
        port: parseInt(process.env.REDIS_PORT!, 10),
        password: process.env.REDIS_PASSWORD!,
      };

      const queue = new Queue(jobInstance.name, {
        prefix: PREFIX,
        defaultJobOptions: jobInstance.options,
        connection,
      });

      const worker = new Worker(
        job.name,
        (bullMQJob) => this.handleJob(bullMQJob, jobInstance),
        {
          prefix: PREFIX,
          autorun: false,
          connection,
        },
      );

      worker.run();

      this.queues.push(queue);
      this.workers.push(worker);
    }

    // Only schedule startup and repeatable jobs on the main thread
    if (!this.configService.isMainThread) {
      return;
    }

    // Clear previously scheduled jobs
    for (const queue of this.queues) {
      const activeJobs = await queue.getRepeatableJobs();

      for (const job of activeJobs) {
        await queue.removeRepeatableByKey(job.key);
      }
    }

    for (const { job, interval } of CRON_JOBS) {
      const queue = this.queues.find((queue) => queue.name === job.name);
      if (!queue) {
        throw new Error(`Implementation queue for job ${job.name} not found`);
      }

      this.loggerService.logService(
        'info',
        LOGGER_NAME,
        `Scheduling CRON job ${job.name} with pattern ${interval}`,
      );
      await queue.add(job.name, undefined, { repeat: { pattern: interval } });
    }

    for (const job of Array.from(STARTUP_JOBS.values())) {
      const queue = this.queues.find((queue) => queue.name === job.name);
      if (!queue) {
        throw new Error(`Implementation queue for job ${job.name} not found`);
      }

      this.loggerService.logService(
        'info',
        LOGGER_NAME,
        `Scheduling startup job ${job.name}`,
      );
      await queue.add(job.name, undefined, { priority: 1 });
    }
  }

  async shutdown() {
    for (const queue of this.queues) {
      await queue.close();
    }

    for (const worker of this.workers) {
      await worker.close();
    }
  }

  private async handleJob(bullMQJob: BullMQJob, job: Job<unknown>) {
    this.loggerService.logService(
      'info',
      LOGGER_NAME,
      `Processing job ${job.name} with id ${bullMQJob.id}`,
    );

    try {
      await job.execute(bullMQJob.data);
      await job.onSuccess(bullMQJob.data);

      this.loggerService.logService(
        'info',
        LOGGER_NAME,
        `Processed job ${job.name} with id ${bullMQJob.id} successfully`,
      );
    } catch (error) {
      console.error(
        `Failed to process job ${job.name} with id ${bullMQJob.id}`,
      );
      console.error(error);

      await job.onFailure(bullMQJob.data, error);

      throw error;
    }
  }
}

export default JobsService;
