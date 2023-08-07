export class ProductsCounterNotExist extends Error {
  constructor() {
    super('The products counter does not exists');
  }
}
