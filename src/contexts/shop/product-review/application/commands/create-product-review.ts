import { Type, number, string, type } from 'io-ts';

import { IdProvider } from '@domain/id-provider';
import { Primitives } from '@domain/value-objects/primitives-type';
import { Command } from '@shared/domain/command';

export const createProductReviewCodec: Type<Primitives<CreateProductReviewCommand>> = type({
  id: string,
  productId: string,
  userId: string,
  rating: number,
  comment: string,
});

export class CreateProductReviewCommand extends Command {
  public id: string;
  public productId: string;
  public userId: string;
  public rating: number;
  public comment: string;

  constructor(id: string, productId: string, userId: string, rating: number, comment: string) {
    super();
    this.id = id || IdProvider.getId();
    this.productId = productId;
    this.userId = userId;
    this.rating = rating;
    this.comment = comment;
  }
}
