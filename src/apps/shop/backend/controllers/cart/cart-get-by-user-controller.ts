import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@domain/command-bus';
import { IdProvider } from '@domain/id-provider';
import { QueryBus } from '@shared/domain/query-bus';
import { CartResponse, CartsResponse } from '@shop-backend/cart/application/cart-response';
import { CreateCartCommand } from '@shop-backend/cart/application/commands/create-cart';
import { SearchCartsByCriteriaQuery } from '@shop-backend/cart/application/search-by-criteria/search-carts-by-criteria-query';

type FilterType = { value: string; operator: string; field: string };

export class CartGetByUserController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async run(_req: Request, res: Response) {
    const { id } = _req.params;

    const filters: Array<FilterType> = [{ field: 'userId', operator: '=', value: id }];
    const orderBy = 'id';
    const order = 'asc';

    const query = new SearchCartsByCriteriaQuery(
      this.parseFilters(filters as Array<FilterType>),
      orderBy as string,
      order as string,
      undefined,
      undefined
    );

    const result = await this.queryBus.ask<CartsResponse>(query);

    const cart = result.carts.length ? result.carts[0] : await this.createNewCart(id);

    res.status(httpStatus.OK).send({ status: httpStatus.OK, message: 'Sucessfully retrieved cart', data: cart });
  }

  private async createNewCart(userId: string): Promise<CartResponse> {
    const id = IdProvider.getId();

    const createCommand = new CreateCartCommand(id, userId);
    await this.commandBus.dispatch(createCommand);
    return {
      id,
      userId,
      items: [],
    };
  }

  private parseFilters(params: Array<FilterType>): Array<Map<string, string>> {
    if (!params) {
      return new Array<Map<string, string>>();
    }

    return params.map((filter) => {
      const field = filter.field;
      const value = filter.value;
      const operator = filter.operator;

      return new Map([
        ['field', field],
        ['operator', operator],
        ['value', value],
      ]);
    });
  }
}
