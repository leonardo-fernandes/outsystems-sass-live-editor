/// <reference path="Workspace.ts" />
/// <reference path="IStylesheetModel.ts" />
/// <reference path="LinkedStylesheet.ts" />


class DocumentModel {

    private readonly $window: any;
    private readonly $document: any;
    private readonly $$: any;

    public readonly workspace: Workspace;

    public readonly stylesheets: IStylesheetModel[] = [];


    public constructor(window: any, $window: any) {
        this.$window = $window;
        this.$document = $window.document;
        this.$$ = $window.$;
        this.workspace = new Workspace(window.$);

        this.initialize();
    }

    private initialize() {
        var stylesheets = this.$$("link[rel=stylesheet][href]");

        for (var i = 0; i < stylesheets.length; i++) {
            this.stylesheets.push(new LinkedStylesheet(this, stylesheets.eq(i)).import());
        }
    }


    public addStyle(stylesheet: IStylesheetModel) {
        return this.$$("<style></style>").appendTo(this.$$("head"));
    }

    public fetch(href: string, onFetch: (css: string) => void, onError: () => void) {
        this.$$.ajax({
            url: href,
            dataType: "text",
            success: onFetch,
            error: onError
        });
    }
}