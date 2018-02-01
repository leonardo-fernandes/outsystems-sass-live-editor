/// <reference path="IStylesheetModel.ts" />

abstract class AbstractStylesheet implements IStylesheetModel {

    protected readonly documentModel: DocumentModel;
    public readonly href: string;

    private tab: any;
    private $style: any;


    private contents: string;
    private originalContents: string;


    public constructor(documentModel: DocumentModel, href: string) {
        this.documentModel = documentModel;
        this.href = href;
    }

    public getOriginalContents() {
        return this.originalContents;
    }
    public getContents() {
        return this.contents;
    }

    public update(contents: string) {
        this.contents = contents;
    }

    public import() {
        /* Create a tab in the workspace */
        this.tab = this.documentModel.workspace.createTab(this);
        this.documentModel.workspace.appendTab(this.tab);
        this.tab.addClass("loading");

        /* Create a <style> element to hold the modified stylesheet */
        this.$style = this.documentModel.addStyle(this);

        this.documentModel.fetch(this.href,
            (css) => this.load(css),
            () => this.error()
        );

        return this;
    }

    private load(css: string) {
        this.originalContents = css;
        this.contents = css;

        this.tab.removeClass("loading");
    }

    private error() {
        this.tab.removeClass("loading").addClass("error");
    }

}