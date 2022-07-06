import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/IEventStore';
import { Repository } from '@infrastructure/repositories/Repository';
import { ILoanRepository } from '@storeback/loan/domain/ILoanRepository';
import { Loan } from '@storeback/loan/domain/Loan';

@injectable()
export class LoanRepository extends Repository<Loan> implements ILoanRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Loan) private readonly eventstore: IEventStore) {
    super(eventstore, Loan);
  }
}
