import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

@Injectable()
export class EventService {
  private eventEmitter = new EventEmitter();

  emit(eventName: string, payload: any): void {
    this.eventEmitter.emit(eventName, payload);
  }

  on(eventName: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(eventName, listener);
  }

  removeListener(eventName: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.removeListener(eventName, listener);
  }
}
