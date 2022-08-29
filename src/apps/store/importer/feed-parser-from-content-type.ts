import { ContentType } from './content-type';
import { FeedParser } from './feed-parser';
import { FeedParserCsv } from './feed-parser-csv';
import { FeedParserJson } from './feed-parser-json';

export class FeedParserFromContentType {
  get(contentType: ContentType): FeedParser {
    if (contentType === ContentType.Csv) return new FeedParserCsv();
    if (contentType === ContentType.Json) return new FeedParserJson();
    const _exhaustiveCheck: never = contentType;
    return _exhaustiveCheck;
  }
}
