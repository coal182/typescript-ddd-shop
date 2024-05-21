import {CommandBus} from '@shared/domain/command-bus';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {UpdateUserCommand} from 'src/contexts/shop/user/application/commands/update-user';

export class UserPutController {
    constructor(private commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const {email, firstname, lastname, dateOfBirth} = req.body;

        const command = new UpdateUserCommand(id, email, firstname, lastname, new Date(dateOfBirth));
        await this.commandBus.dispatch(command);

        res.status(httpStatus.CREATED).send({status: httpStatus.OK, message: 'Sucessfully updated user'});
    }
}
