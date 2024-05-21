import {ContentType} from './content-type';

export class Feed {
    constructor(
        readonly filePath: string,
        readonly contentType: ContentType,
    ) {}
}
