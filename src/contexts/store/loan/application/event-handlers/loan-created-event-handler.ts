import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandBus } from '@core/i-command-bus';
import { IEventHandler } from '@core/i-event-handler';
import { LoanCreated } from '@storeback/loan/domain/events/LoanCreated';

@injectable()
export class LoanCreatedEventHandler implements IEventHandler<LoanCreated> {
  public event: string = LoanCreated.name;

  constructor(@inject(TYPES.CommandBus) private readonly commandBus: ICommandBus) {}

  async handle(event: LoanCreated) {
    console.log(`Book with the ID ${event.bookId} loaned by the user ${event.userId}`);
  }
}
