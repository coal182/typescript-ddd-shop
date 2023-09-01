import 'reflect-metadata';
import { Request, Response } from 'express';
import sinon, { createStubInstance } from 'sinon';

import { IdProvider } from '@domain/id-provider';
import WinstonLogger from '@infrastructure/winston-logger';
import { CreateProductCommand } from '@shop-backend/product/application/commands/create-product';
import { ProductPostController } from '@shop-backend-app/controllers/product-post-controller';
import CommandBusMock from 'tests/contexts/shared/domain/command-bus-mock';

describe(ProductPostController.name, () => {
  const commandBusMock = new CommandBusMock();
  const logger = createStubInstance(WinstonLogger);
  const productController = new ProductPostController(commandBusMock, logger);
  describe('when requested to create a product', () => {
    const sandbox = sinon.createSandbox();

    const status = sandbox.stub();
    const json = sandbox.spy();
    const res = { json, status } as unknown as Response;
    status.returns(res);

    afterEach(function () {
      sinon.restore();
      sandbox.restore();
    });

    const id = IdProvider.getId();

    const req = {
      body: {
        id,
        name: 'Test Product',
        description: 'Test Product Description',
        images: ['test-image.jpg', 'test-image-2.jpg'],
        authorId: 'Test Author Id',
        price: 'Test Product Price',
        brand: 'Test Product Brand',
        category: 'Test Product Category',
        ean: 'Test Product EAN',
      },
    } as Request;

    productController.run(req, res);

    const { name, description, images, price, brand, category, ean } = req.body;

    const expectedCommand = new CreateProductCommand(id, name, description, images, price, brand, category, ean);

    it('should send a CreateProductCommand to the command bus', async () => {
      commandBusMock.assertLastDispatchedCommandIs(expectedCommand);
    });
  });
});
