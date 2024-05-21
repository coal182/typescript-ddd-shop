import {CommandBus} from '@shared/domain/command-bus';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {CreateUserCommand} from 'src/contexts/shop/user/application/commands/create-user';

type UserPostRequest = Request & {
    body: {
        id?: string;
        email: string;
        firstname: string;
        lastname: string;
        dateOfBirth: string;
        password: number;
    };
};

export class UserPostController {
    constructor(private commandBus: CommandBus) {}

    async run(req: Request<UserPostRequest>, res: Response): Promise<void> {
        const {id, email, firstname, lastname, dateOfBirth, password} = req.body;
        const createUserCommand = new CreateUserCommand(id, email, firstname, lastname, new Date(dateOfBirth), password);
        await this.commandBus.dispatch(createUserCommand);

        res.status(httpStatus.CREATED).send();
    }
}
