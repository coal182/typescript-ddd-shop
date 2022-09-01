import { AggregateRoot } from '@core/aggregate-root';
import { Uuid } from '@shared/value-objects/uuid';

import { LoanCreated } from './events/LoanCreated';

export class Loan extends AggregateRoot {
  public guid: Uuid;
  public bookId: string;
  public userId: string;

  constructor();

  constructor(guid: string, bookId: string, userId: string);

  constructor(guid?: string, bookId?: string, userId?: string) {
    super();
    if (guid && bookId && userId) {
      this.applyChange(new LoanCreated(guid, bookId, userId));
    }
  }

  applyLoanCreated(event: LoanCreated) {
    this.guid = new Uuid(event.guid);
    this.userId = event.userId;
    this.bookId = event.bookId;
  }
}
