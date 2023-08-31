import { IdProvider } from '@domain/id-provider';
import { Command } from '@shared/domain/command';

export class CreateUserCommand extends Command {
  public id: string;
  public email: string;
  public firstname: string;
  public lastname: string;
  public dateOfBirth: Date;
  public password: string;

  constructor(id: string, email: string, firstname: string, lastname: string, dateOfBirth: Date, password: string) {
    super();
    this.id = id || IdProvider.getId();
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
  }
}
