import { CommandBus } from '@infrastructure/command-bus';
import { PasswordNotMatchException, NotFoundException } from '@shared/errors/application-error';
import { TYPES } from '@storeback/shared/constants/types';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';
import { IAuthorReadModelFacade } from 'src/contexts/store/author/infrastructure/projection/authors/read-model';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserCommand } from 'src/contexts/shop/user/application/commands/create-user';
import { UpdateUserCommand } from 'src/contexts/shop/user/application/commands/update-user';
import { UpdateUserPasswordCommand } from 'src/contexts/shop/user/application/commands/update-user-password';
import { IUserReadModelFacade } from 'src/contexts/shop/user/infrastructure/projection/users/read-model';

import { verifyJWT_MW } from '../middlewares/auth';
import { ok } from '../processors/response';

@controller('/api/v1/users', verifyJWT_MW)
export class UserController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.AuthorReadModelFacade) private readonly authorReadModel: IAuthorReadModelFacade,
    @inject(TYPES.UserReadModelFacade) private readonly userReadModel: IUserReadModelFacade
  ) {}

  @httpPost('')
  async createUser(@request() req: Request, @response() res: Response) {
    const { email, firstname, lastname, dateOfBirth, password } = req.body;
    let id = uuidv4();
    if (req.body.id) {
      id = req.body.id;
    }
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    const command = new CreateUserCommand(id, email, firstname, lastname, new Date(dateOfBirth), hash);
    await this.commandBus.send(command);
    return res.json(ok('Successfully created the user', undefined));
  }

  @httpGet('/')
  async getAllAuthors(@request() req: Request, @response() res: Response) {
    const authors = await this.authorReadModel.getAll();
    return res.json(ok('Successfully retrieved all authors', authors));
  }

  @httpGet('/:guid')
  async getById(@request() req: Request, @response() res: Response) {
    const user = await this.userReadModel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the user', user));
  }

  @httpPut('/:guid')
  async updateUser(@request() req: Request, @response() res: Response) {
    const { email, firstname, lastname, dateOfBirth, version } = req.body;

    const userData = await this.userReadModel.getById(req.params.guid);

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    const command = new UpdateUserCommand(req.params.guid, email, firstname, lastname, dateOfBirth, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the user', undefined));
  }

  @httpPut('/:guid/password')
  async updatePassword(@request() req: Request, @response() res: Response) {
    const { currentPassword, newPassword, newPasswordConfirm, version } = req.body;

    const userData = await this.userReadModel.getById(req.params.guid);

    if (!compareSync(currentPassword, userData.password)) {
      throw new PasswordNotMatchException('Current password do not match');
    }

    if (newPassword !== newPasswordConfirm) {
      throw new PasswordNotMatchException('New Passwords do not match');
    }

    const salt = genSaltSync(10);
    const hash = hashSync(newPassword, salt);

    const command = new UpdateUserPasswordCommand(req.params.guid, hash, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the user', undefined));
  }
}
