/*
  This file is used to set the 'bee' library as well all jobs
and queues that Redis will process.
*/

import Bee from 'bee-queue';

import redisConfig from '../config/redis';
import CancellationMail from '../app/jobs/CancellationMail';

// all avaible jobs
const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {}; // cancellation, appointment queues
    this.init(); // starts the queues
  }

  init() {
    // adds job types in the queues
    // being each queue for a different job type
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    // adds jobs inside a especific queue
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    // processes each queue and its jobs
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    // if any jobs return an error, the error is printed
    // on the console
    console.log(`Queue ${job.queue.name}: FAILED!`, err);
  }
}

export default new Queue();
