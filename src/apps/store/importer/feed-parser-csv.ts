import { readFile, utils, WorkBook, WorkSheet } from 'xlsx';

import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { ParsingError } from '@shared/domain/errors/parsing-error';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';

import { Feed } from './feed';
import { FeedParser } from './feed-parser';

export class FeedParserCsv implements FeedParser {
  private feed: Feed;

  async parse(feed: Feed): Promise<Array<CreateBookCommand>> {
    this.feed = feed;

    return this.getWorkBook()
      .then((workBook) => this.getFirstSheet(workBook))
      .then((workSheet) => this.getRawJson(workSheet))
      .then((rawJson) => {
        return rawJson.map((item: any) => {
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
      });
  }

  private getWorkBook(): Promise<WorkBook> {
    return new Promise((resolve, reject) => {
      try {
        const workBook = readFile(this.feed.filePath, { raw: true });
        resolve(workBook);
      } catch (err) {
        reject(this.translateFileReadError(err as Error));
      }
    });
  }

  private getFirstSheet(workBook: WorkBook): WorkSheet {
    return workBook.Sheets[workBook.SheetNames[0]];
  }

  private getRawJson(workSheet: WorkSheet): Array<object> {
    return utils.sheet_to_json<object>(workSheet);
  }

  private translateFileReadError(err: NodeJS.ErrnoException): Error {
    const message = `Failed to parse file ${this.feed.filePath}`;

    return err.code === 'ENOENT' ? new NotFoundError(message) : new ParsingError(message);
  }
}
