import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SinonStub, assert, stub } from 'sinon';

import { QueryBus } from '@shared/domain/query-bus';
import { ProductsCounterGetController } from '@shop-backend-app/controllers/product/products-counter-get-controller';

describe('ProductCounterGetController', () => {
  let queryBus: QueryBus;
  let controller: ProductsCounterGetController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  const mockedTotal = { total: 25 };

  beforeEach(() => {
    queryBus = {
      ask: stub().resolves(mockedTotal),
    };
    controller = new ProductsCounterGetController(queryBus);

    req = {};
    res = {
      status: stub().returnsThis(), // stub 'status' and make it chainable
      send: stub(), // stub 'send' method
    };
  });

  it('should respond with status 200 and correct data', async () => {
    // Run the controller
    await controller.run(req as Request, res as Response);

    // Assert the response
    assert.calledWith(res.status as SinonStub, httpStatus.OK);
    assert.calledWith(res.send as SinonStub, {
      status: httpStatus.OK,
      message: 'Successfully retrieved products count',
      total: mockedTotal.total,
    });
  });
});
