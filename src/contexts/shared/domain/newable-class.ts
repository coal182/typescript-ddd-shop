// eslint-disable-next-line @typescript-eslint/ban-types
export interface NewableClass<T> extends Function {
    new (...args: any[]): T;
}
