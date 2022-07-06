import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { CreateLoanCommand } from '@storeback/loan/application/commands/CreateLoan';
import { ILoanRepository } from '@storeback/loan/domain/ILoanRepository';
import { Loan } from '@storeback/loan/domain/Loan';

@injectable()
export class CreateLoanCommandHandler implements ICommandHandler<CreateLoanCommand> {
  constructor(@inject(TYPES.LoanRepository) private readonly repository: ILoanRepository) {}
  public static commandToHandle: string = CreateLoanCommand.name;
  async handle(command: CreateLoanCommand) {
    const loan: Loan = new Loan(command.guid, command.bookId, command.userId);
    await this.repository.save(loan, -1);
  }
}
