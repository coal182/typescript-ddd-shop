import 'reflect-metadata';
import { expect } from 'chai';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createStubInstance, stub, spy } from 'sinon';

import { CreateProductCommand } from '@backoffice-backend/product/application/commands/create-product';
import { ProductPostController } from '@backoffice-backend-app/controllers/product-post-controller';
import { IdProvider } from '@domain/id-provider';
import WinstonLogger from '@infrastructure/winston-logger';
import CommandBusMock from 'tests/contexts/shared/domain/command-bus-mock';

describe(ProductPostController.name, () => {
  const commandBusMock = new CommandBusMock();
  const logger = createStubInstance(WinstonLogger);
  const productController = new ProductPostController(commandBusMock, logger);

  describe('when requested to create a product', () => {
    const status = stub();
    const json = spy();
    const res = { json, status } as unknown as Response;

    const id = IdProvider.getId();
    describe('when request is valid', () => {
      const req = {
        body: {
          id,
          name: 'Test Product',
          description: 'Test Product Description',
          images: ['test-image.jpg', 'test-image-2.jpg'],
          price: 5.99,
          brand: 'Test Product Brand',
          category: 'Test Product Category',
          ean: 'Test Product EAN',
        },
      } as Request;

      productController.run(req, res);

      const { name, description, images, price, brand, category, ean } = req.body;

      const expectedCommand = new CreateProductCommand(id, name, description, images, price, brand, category, ean);

      it('should send a CreateProductCommand to command bus', async () => {
        commandBusMock.assertLastDispatchedCommandIs(expectedCommand);
      });
    });

    describe('when request is invalid', () => {
      const req = {
        body: {
          id,
          name: 'Test Product',
          description: 'Test Product Description',
          images: ['test-image.jpg', 'test-image-2.jpg'],
          price: 'invalid-price',
          brand: 'Test Product Brand',
          category: 'Test Product Category',
          ean: 'Test Product EAN',
        },
      } as Request;

      productController.run(req, res);

      it('should fail with bad request status code', async () => {
        expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
      });
    });
  });
});
