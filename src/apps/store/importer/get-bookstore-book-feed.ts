import fs from 'fs';

import { ContentType } from './content-type';
import { Feed } from './feed';

export function getBookstoreBookFeed(): Feed {
  const enabledContentType = 'text/csv';

  if (enabledContentType === ContentType.Csv) {
    const content = fs.readFileSync(__dirname + '/data/bookstore-inventory.csv').toString();
    return new Feed(content, ContentType.Csv);
  } else {
    const content = fs.readFileSync(__dirname + '/data/bookstore-inventory.json').toString();
    return new Feed(content, ContentType.Json);
  }
}
