import 'reflect-metadata';
import { expect, should } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';

import { CreateBookCommand } from '@commands/book/CreateBook';
import { CommandBus } from '@infrastructure/commandBus';

import { BookReadModelFacadeMock } from '../../../test/application/projection/book/ReadModel';

import { BookController } from './BookController';

describe(BookController.name, () => {
  const commandBus = new CommandBus();
  const readmodelMock = new BookReadModelFacadeMock();
  const commandBusMock = sinon.stub(commandBus);
  const bookController = new BookController(commandBusMock, readmodelMock);
  describe('when requested to create a book', () => {
    const sandbox = sinon.createSandbox();

    const status = sandbox.stub();
    const json = sandbox.spy();
    const res = { json, status } as unknown as Response;
    status.returns(res);

    afterEach(function () {
      sinon.restore();
      sandbox.restore();
    });

    const id = uuidv4();

    const req = {
      body: {
        id,
        name: 'Test Book',
        description: 'Test Book Description',
        image: 'Test Book Image',
        authorId: 'Test Author Id',
        price: 'Test Book Price',
      },
    } as Request;

    bookController.createBook(req as Request, res);

    const { name, description, image, authorId, price } = req.body;

    const expectedCommand = new CreateBookCommand(id, name, description, image, authorId, price);

    it('should send a command to the command bus', async () => {
      await expect(commandBusMock.send.calledOnce).to.be.true;
      await expect(commandBusMock.send.calledWith(expectedCommand)).to.be.true;
      await expect(commandBusMock.send.getCall(0).args[0]).to.be.deep.equal(expectedCommand);
    });
  });
});
