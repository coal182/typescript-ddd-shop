import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@storeback/shared/constants/types';
import { IEventStore } from '@core/i-event-store';
import { Repository } from '@infrastructure/repositories/repository';
import { ILoanRepository } from '@storeback/loan/domain/i-loan-repository';
import { Loan } from '@storeback/loan/domain/loan';

@injectable()
export class LoanRepository extends Repository<Loan> implements ILoanRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Loan) private readonly eventstore: IEventStore) {
    super(eventstore, Loan);
  }
}
