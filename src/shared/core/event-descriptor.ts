import { IEvent } from './i-event';

export class EventDescriptor {
  constructor(
    public readonly aggregateGuid: string,
    public readonly aggregateName: string,
    public readonly data: IEvent,
    public readonly version: number
  ) {}
}
