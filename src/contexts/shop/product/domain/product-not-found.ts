export class ProductNotFound extends Error {
    constructor(id: string) {
        super(`Product with id <${id}> does not exists`);
    }
}
