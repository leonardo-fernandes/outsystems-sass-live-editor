declare class Sass {
    constructor();
}




class DocumentModel {

    private readonly $$: any;
    private readonly $window: any;
    private readonly $document: any;

    public readonly workspace: Workspace;

    public readonly stylesheets: IStylesheetModel[] = [];


    public constructor($: any, $window: any) {
        this.$window = $window;
        this.$document = $window.document;
        this.$$ = $window.$;
        this.workspace = new Workspace($);

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