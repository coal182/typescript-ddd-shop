import {CommandBus} from '@shared/domain/command-bus';
import {UpdateUserPasswordCommand} from '@shop-backend/user/application/commands/update-user-password';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class UserPutPasswordController {
    constructor(private commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {currentPassword, newPassword, newPasswordConfirm} = req.body;

        const command = new UpdateUserPasswordCommand(id, newPassword);
        await this.commandBus.dispatch(command);

        res.status(httpStatus.CREATED).send();
    }
}
