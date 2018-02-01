interface IStylesheetModel {
    
    readonly href: string;

    getOriginalContents(): string;
    getContents(): string;

    update(contents: string): void;
}