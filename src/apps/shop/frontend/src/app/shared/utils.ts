export type OnChangeFn<T> = (newValue: T) => void;
export type NoOp = () => void;
export function noop(): void {}
