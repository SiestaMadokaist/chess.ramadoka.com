import { EventEmitter } from 'events';

export enum SERVICE_EVENT {
  ERROR = 'ERROR',
  MESSAGE = 'MESSAGE',
  CLEAR = 'CLEAR',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
}

export interface ServiceEmitter extends EventEmitter {
  emit(event: SERVICE_EVENT.CLEAR): boolean;
  emit(event: SERVICE_EVENT.MESSAGE | SERVICE_EVENT.BLOCK | SERVICE_EVENT.UNBLOCK, message: string): boolean;
  emit(event: SERVICE_EVENT.ERROR, error: Error): boolean;
  on(message: SERVICE_EVENT, callback: (...args: any[]) => void): this;
}
