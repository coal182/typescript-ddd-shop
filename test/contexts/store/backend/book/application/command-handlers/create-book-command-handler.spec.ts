import 'reflect-metadata';
import { expect } from 'chai';

import { CreateBookCommandHandler } from '@storeback/book/application/command-handlers/create-book-command-handler';

describe(CreateBookCommandHandler.name, () => {
  it('Test', () => {
    expect(true).to.be.true;
  });
});
