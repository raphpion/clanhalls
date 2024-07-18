import { type Job as BullMQJob, Queue, Worker } from 'bullmq';
import { singleton } from 'tsyringe';

import type { JobClass } from './job';
import type Job from './job';

export interface IJobsService {
  add<T>(job: JobClass<T>, payload?: T): Promise<unknown>;
}

const PREFIX = 'jobs';

@singleton()
class JobsService implements IJobsService {
  private queues: Map<string, Queue>;
  private workers: Map<string, Worker>;

  constructor() {
    this.queues = new Map();
    this.workers = new Map();
  }

  async add<T>(job: JobClass<T>, payload?: T) {
    console.log(`Adding job of type ${job.name}`);
    const queue = await this.getQueueOrInit(job);
    const task = await queue.add(job.name, payload);

    console.log(`Added job ${job.name} with id ${task.id}`);

    return task;
  }

  private async getQueueOrInit<T>(job: JobClass<T>) {
    const jobInstance = new job();

    if (this.queues.has(jobInstance.name)) {
      return this.queues.get(jobInstance.name);
    }

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

    this.queues.set(job.name, queue);
    this.workers.set(job.name, worker);

    return queue;
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
