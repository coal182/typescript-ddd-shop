import { ContentType } from './content-type';
import { Feed } from './feed';

export function getBookstoreBookFeed(enabledContentType: ContentType = ContentType.Json): Feed {
  /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
  switch (enabledContentType) {
    case ContentType.Csv: {
      const filePath = __dirname + '/data/products.csv';
      return new Feed(filePath, ContentType.Csv);
    }
    case ContentType.Json: {
      const filePath = __dirname + '/data/products.json';
      return new Feed(filePath, ContentType.Json);
    }
    default: {
      const _exhaustiveCheck: never = enabledContentType;
      return _exhaustiveCheck;
    }
  }
}
