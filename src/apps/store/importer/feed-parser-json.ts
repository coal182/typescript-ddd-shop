import * as fs from 'fs';

import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { ParsingError } from '@shared/domain/errors/parsing-error';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';

import { Feed } from './feed';
import { FeedParser } from './feed-parser';

export class FeedParserJson implements FeedParser {
  private feed: Feed;

  async parse(feed: Feed): Promise<Array<CreateBookCommand>> {
    this.feed = feed;

    return new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(this.feed.filePath).toString();
        const items = JSON.parse(content);
        const commands = items.map((item: any) => {
          const command = new CreateBookCommand(
            item.id,
            item.name,
            item.description,
            item.image,
            item.author,
            item.price
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
