import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/command-bus';
import Logger from '@shared/domain/logger';
import { UpdateUserCommand } from 'src/contexts/shop/user/application/commands/update-user';

export class UserPutController {
  constructor(private commandBus: CommandBus, private logger: Logger) {}

  async run(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, firstname, lastname, dateOfBirth } = req.body;

      const command = new UpdateUserCommand(id, email, firstname, lastname, new Date(dateOfBirth));
      await this.commandBus.dispatch(command);

      res.status(httpStatus.CREATED).send();
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e);
      }
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
