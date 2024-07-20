import { type Job as BullMQJob, Queue, Worker } from 'bullmq';
import { singleton } from 'tsyringe';

import ApplyMemberActivityReportDataJob from './clans/reports/applyMemberActivityReportDataJob';
import ApplyPendingMemberActivityReportDataJob from './clans/reports/applyPendingMemberActivityReportsDataJob';
import ApplySettingsReportDataJob from './clans/reports/applySettingsReportDataJob';
import type { JobClass } from './job';
import type Job from './job';
import AssociatePlayerToWiseOldManJob from './players/associatePlayerToWiseOldManJob';
import { getThreadIndex } from '../env';

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
  ApplyPendingMemberActivityReportDataJob,
  ApplySettingsReportDataJob,
  AssociatePlayerToWiseOldManJob,
] as JobClass<unknown>[];

const CRON_JOBS: CronJob[] = [
  // every day at 00:00
  { job: ApplyMemberActivityReportDataJob, interval: '0 0 * * *' },
];

const STARTUP_JOBS: JobClass<unknown>[] = [];

@singleton()
class JobsService implements IJobsService {
  private queues: Queue[];
  private workers: Worker[];

  constructor() {
    this.queues = [];
    this.workers = [];
  }

  async add<T>(job: JobClass<T>, payload?: T) {
    console.log(`Adding job of type ${job.name}`);
    const queue = this.queues.find((queue) => queue.name === job.name);
    if (!queue) {
      throw new Error(`Implementation queue for job ${job.name} not found`);
    }

    const task = await queue.add(job.name, payload);
    return task;
  }

  async initialize() {
    const isMainThread =
      process.env.NODE_ENV === 'development' || getThreadIndex() === 0;

    for (const job of JOBS) {
      const jobInstance = new job();

      const connection = {
        host: process.env.REDIS_HOST,
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
        }
      );

      worker.run();

      this.queues.push(queue);
      this.workers.push(worker);
    }

    // Only schedule startup and repeatable jobs on the main thread
    if (!isMainThread) {
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

      console.log(`Scheduling CRON job ${job.name} with pattern ${interval}`);
      await queue.add(job.name, undefined, { repeat: { pattern: interval } });
    }

    for (const job of Array.from(STARTUP_JOBS.values())) {
      const queue = this.queues.find((queue) => queue.name === job.name);
      if (!queue) {
        throw new Error(`Implementation queue for job ${job.name} not found`);
      }

      console.log(`Scheduling startup job ${job.name}`);
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
    console.log(`Processing job ${job.name} with id ${bullMQJob.id}`);

    try {
      await job.execute(bullMQJob.data);
      await job.onSuccess(bullMQJob.data);

      console.log(
        `Processed job ${job.name} with id ${bullMQJob.id} successfully`
      );
    } catch (error) {
      console.error(
        `Failed to process job ${job.name} with id ${bullMQJob.id}`
      );
      console.error(error);

      await job.onFailure(bullMQJob.data, error);

      throw error;
    }
  }
}

export default JobsService;
