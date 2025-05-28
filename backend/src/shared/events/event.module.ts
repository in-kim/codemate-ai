import { Global, Module } from '@nestjs/common';
import { EventService } from './event.service';

@Global()
@Module({
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
