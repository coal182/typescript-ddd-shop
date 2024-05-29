export abstract class PopupService {
    abstract open(title: string, html: string, type: string): void;
}
