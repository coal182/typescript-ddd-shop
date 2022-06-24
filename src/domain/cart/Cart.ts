import { AggregateRoot } from '@core/AggregateRoot';

import { CartCreated } from './events/CartCreated';

export class Cart extends AggregateRoot {
  public userId: string;

  constructor();

  constructor(guid: string, userId: string);

  constructor(guid?: string, userId?: string) {
    super(guid);
    if (guid && userId) {
      this.applyChange(new CartCreated(guid, userId));
    }
  }

  applyCartCreated(event: CartCreated) {
    this.guid = event.guid;
    this.userId = event.userId;
  }
}
