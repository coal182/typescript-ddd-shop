import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { CreateLoanCommand } from '@storeback/loan/application/commands/create-loan';
import { ILoanRepository } from '@storeback/loan/domain/i-loan-repository';
import { Loan } from '@storeback/loan/domain/loan';

@injectable()
export class CreateLoanCommandHandler implements ICommandHandler<CreateLoanCommand> {
  constructor(@inject(TYPES.LoanRepository) private readonly repository: ILoanRepository) {}
  public static commandToHandle: string = CreateLoanCommand.name;
  async handle(command: CreateLoanCommand) {
    const loan: Loan = new Loan(command.guid, command.bookId, command.userId);
    await this.repository.save(loan, -1);
  }
}
