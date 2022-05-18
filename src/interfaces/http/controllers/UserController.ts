import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';

import { CreateUserCommand } from '@commands/user/CreateUser';
import { TYPES } from '@constants/types';
import { CommandBus } from '@infrastructure/commandBus';

import { IAuthorReadModelFacade } from '../../../application/projection/author/ReadModel';
import { ok } from '../processors/response';

@controller('/api/v1/users')
export class UserController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.AuthorReadModelFacade) private readonly readmodel: IAuthorReadModelFacade
  ) {}

  @httpPost('')
  async createUser(@request() req: Request, @response() res: Response) {
    const { email, firstname, lastname, dateOfBirth } = req.body;
    const command = new CreateUserCommand(email, firstname, lastname, new Date(dateOfBirth));
    await this.commandBus.send(command);
    return res.json(ok('Successfully created the user', undefined));
  }

  @httpGet('/')
  async getAllAuthors(@request() req: Request, @response() res: Response) {
    const authors = await this.readmodel.getAll();
    return res.json(ok('Successfully retrieved all authors', authors));
  }

  @httpGet('/:guid')
  async getById(@request() req: Request, @response() res: Response) {
    const author = await this.readmodel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the author', author));
  }
}
