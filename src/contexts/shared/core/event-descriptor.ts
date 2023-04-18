import type { WithId, Document } from 'mongodb';

import { IEvent } from './i-event';

export interface IEventDescriptor extends WithId<Document> {
  aggregateGuid: string;
  aggregateName: string;
  data: IEvent;
  version: number;
}

export class EventDescriptor {
  constructor(
    public readonly aggregateGuid: string,
    public readonly aggregateName: string,
    public readonly data: IEvent,
    public readonly version: number
  ) {}
}
