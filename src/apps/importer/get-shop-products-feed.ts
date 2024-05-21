import {ContentType} from './content-type';
import {Feed} from './feed';

export function getShopProductsFeed(enabledContentType: ContentType = ContentType.Json): Feed {
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
