import { Command } from '@core/command';

export class CreateLoanCommand extends Command {
  public bookId: string;
  public userId: string;
  public static commandName = CreateLoanCommand.name;

  constructor(bookId: string, userId: string, guid?: string) {
    super(guid);
    this.bookId = bookId;
    this.userId = userId;
  }
}
