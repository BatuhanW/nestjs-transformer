import { OnGlobalQueueError, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { VerificationRequestHandler } from './handlers/verification-request.handler';

@Processor('scheduler')
export class SchedulerProcessor {
  constructor(private verificationHandler: VerificationRequestHandler) {}

  @OnQueueError()
  onError(error: Error): void {
    console.log('onQueueError');
    console.error(error);
  }

  @OnGlobalQueueError()
  onGlobaError(error: Error) {
    console.log('onGlobalQueueError');
    console.error(`${this.constructor.name} Global Error, exiting`, { error });
    process.exit(1);
  }

  @OnQueueFailed()
  onFailed(job: Job<any>, error: Error) {
    console.log('Failed!!!', { tried: job.attemptsMade });
  }

  @Process('process')
  async handleProcess(job: Job<Record<string, any>>): Promise<void> {
    console.log('Starting');
    await this.verificationHandler.handle(job.data);
    console.log('Done');
  }
}
