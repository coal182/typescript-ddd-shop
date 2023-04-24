import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/command-bus';
import { UpdateUserCommand } from 'src/contexts/shop/user/application/commands/update-user';

export class UserPutController {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id } = req.params;
    const { email, firstname, lastname, dateOfBirth } = req.body;

    const command = new UpdateUserCommand(id, email, firstname, lastname, dateOfBirth);
    await this.commandBus.dispatch(command);

    res.status(httpStatus.CREATED).send();
  }
}
