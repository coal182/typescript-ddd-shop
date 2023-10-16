export class ProductReviewByProductIdNotFound extends Error {
  constructor(id: string) {
    super(`No Product Reviews found with Product Id <${id}>`);
  }
}
