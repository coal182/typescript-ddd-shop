import * as fs from 'fs';

import { v4 as uuidv4 } from 'uuid';

import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { ParsingError } from '@shared/domain/errors/parsing-error';
import { CreateProductCommand } from '@shop-backend/product/application/commands/create-product';

import { Feed } from './feed';
import { FeedParser } from './feed-parser';

export class FeedParserJson implements FeedParser {
  private feed: Feed;

  async parse(feed: Feed): Promise<Array<CreateProductCommand>> {
    this.feed = feed;

    return new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(this.feed.filePath).toString();
        const items = JSON.parse(content);
        const commands = items.map((item: any) => {
          item.id = uuidv4();
          const command = new CreateProductCommand(
            item.id,
            item.name,
            item.description,
            item.image,
            item.price,
            item.brand,
            item.category,
            item.ean
          );
          return command;
        });
        resolve(commands);
      } catch (err) {
        reject(this.translateFileReadError(err as Error));
      }
    });
  }

  private translateFileReadError(err: NodeJS.ErrnoException): Error {
    const message = `Failed to parse file ${this.feed.filePath}`;

    return err.code === 'ENOENT' ? new NotFoundError(message) : new ParsingError(message);
  }
}
