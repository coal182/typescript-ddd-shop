import * as fs from 'fs';

import { ParamsParser } from '@domain/params-parser';
import { Primitives } from '@domain/value-objects/primitives-type';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { ParsingError } from '@shared/domain/errors/parsing-error';
import { CreateProductCommand, createProductCodec } from '@shop-backend/product/application/commands/create-product';

import { Feed } from './feed';
import { FeedParser } from './feed-parser';

export class FeedParserJson implements FeedParser {
  private feed: Feed;

  parse(feed: Feed): Promise<Array<CreateProductCommand>> {
    this.feed = feed;

    return new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(this.feed.filePath).toString();
        const items = JSON.parse(content);
        const commands = items.map((item: any) => {
          const { id, name, description, images, price, brand, category, ean } = ParamsParser.parse<
            Primitives<CreateProductCommand>
          >(item, createProductCodec);
          const command = new CreateProductCommand(id, name, description, images, price, brand, category, ean);
          return command;
        });
        resolve(commands);
      } catch (err) {
        reject(this.translateFileReadError(err as Error));
      }
    });
  }

  private translateFileReadError(err: NodeJS.ErrnoException): Error {
    const message = `Failed to parse file ${this.feed.filePath} Cause: ${err.message}`;

    return err.code === 'ENOENT' ? new NotFoundError(message) : new ParsingError(message);
  }
}
