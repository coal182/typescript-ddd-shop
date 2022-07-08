import { Command } from '@core/command';

export class CreateUserCommand extends Command {
  public email: string;
  public firstname: string;
  public lastname: string;
  public dateOfBirth: Date;
  public password: string;

  constructor(email: string, firstname: string, lastname: string, dateOfBirth: Date, password: string, guid?: string) {
    super(guid);
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
  }
}
