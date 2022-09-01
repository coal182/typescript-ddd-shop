import { ContentType } from './content-type';
import { FeedParser } from './feed-parser';
import { FeedParserCsv } from './feed-parser-csv';
import { FeedParserJson } from './feed-parser-json';

export class FeedParserFromContentType {
  get(contentType: ContentType): FeedParser {
    /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
    switch (contentType) {
      case ContentType.Csv:
        return new FeedParserCsv();
      case ContentType.Json:
        return new FeedParserJson();
      default: {
        const _exhaustiveCheck: never = contentType;
        return _exhaustiveCheck;
      }
    }
  }
}
