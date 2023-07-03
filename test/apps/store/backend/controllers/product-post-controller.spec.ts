import 'reflect-metadata';
import { Request, Response } from 'express';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';

import { CreateProductCommand } from '@storeback/product/application/commands/create-product';
import { ProductPostController, ProductPostRequest } from '@storebackapp/controllers/product-post-controller';
import CommandBusMock from 'test/contexts/shared/domain/command-bus-mock';

describe(ProductPostController.name, () => {
  const commandBusMock = new CommandBusMock();
  const productController = new ProductPostController(commandBusMock);
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

    const id = uuidv4();

    const req = {
      body: {
        id,
        name: 'Test Product',
        description: 'Test Product Description',
        image: 'Test Product Image',
        authorId: 'Test Author Id',
        price: 'Test Product Price',
        brand: 'Test Product Brand',
        category: 'Test Product Category',
        ean: 'Test Product EAN',
      },
    } as Request<ProductPostRequest>;

    productController.run(req, res);

    const { name, description, image, price, brand, category, ean } = req.body;

    const expectedCommand = new CreateProductCommand(id, name, description, image, price, brand, category, ean);

    it('should send a CreateProductCommand to the command bus', async () => {
      commandBusMock.assertLastDispatchedCommandIs(expectedCommand);
    });
  });
});
