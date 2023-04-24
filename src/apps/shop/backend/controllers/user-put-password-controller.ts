import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/command-bus';
import { UpdateUserPasswordCommand } from '@storeback/user/application/commands/update-user-password';

export class UserPutPasswordController {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword, newPasswordConfirm } = req.body;

      const command = new UpdateUserPasswordCommand(id, newPassword);
      await this.commandBus.dispatch(command);

      res.status(httpStatus.CREATED).send();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
