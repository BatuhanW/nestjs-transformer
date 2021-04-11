import { OnGlobalQueueError, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { VerificationRequestMuavin } from './verification-request.muavin';
import { AnyObject } from '@core';

@Processor('scheduler')
export class SchedulerProcessor {
  constructor(private verificationMuavin: VerificationRequestMuavin) {}

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
    console.log('Failed!!!', { error, tried: job.attemptsMade });
  }

  @Process('process')
  async handleProcess(job: Job<Record<string, any>>): Promise<void> {
    console.log('Starting');
    const payload = await this.verificationMuavin.handle(job.data);

    await this.verificationMuavin.scheduleActions(payload);
    console.log('Done');
  }

  @Process('handleAction')
  async handleAction(job: Job<AnyObject>): Promise<void> {
    const { name, payload } = job.data;
    await this.verificationMuavin.handleAction(payload, name);
  }
}
