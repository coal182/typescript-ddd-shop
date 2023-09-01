import { Type } from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

import { WrongRequestDataError } from './errors/wrong-request-data-error';

export class ParamsParser {
  static parse<T>(params: T, codec: Type<T, T, unknown>): T {
    const result = codec.decode(params);

    if (result._tag === 'Left') {
      const errorMessages = PathReporter.report(result);
      const errorMsg = `Invalid request data params: ${errorMessages.join(', ')}`;
      throw new WrongRequestDataError(errorMsg);
    }

    return result.right;
  }
}
