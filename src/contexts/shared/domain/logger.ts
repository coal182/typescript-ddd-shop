export default interface Logger {
  debug(message: string): void;
  error(message: string | Error): void;
  info(message: string): void;
  // eslint-disable-next-line semi
}
