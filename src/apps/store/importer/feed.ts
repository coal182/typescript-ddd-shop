import { ContentType } from './content-type';

export class Feed {
  constructor(readonly content: string, readonly contentType: ContentType) {}
}
