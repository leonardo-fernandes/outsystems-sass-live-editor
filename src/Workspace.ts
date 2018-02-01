class Workspace {

    private $: any;

    public code: any;
    public workspace: any;
    public template: any;

    public constructor($: any) {
        this.code = $(".code-column textarea");
        this.workspace = $(".workspace-column .workspace");
        this.template = this.workspace.find(".stylesheet.client-side-template");

        this.initialize();
    }

    private initialize() {
        /* Wire up the events */
        this.$("body").on("click", ".workspace .stylesheet a", (evt: Event) => {
            let tab = this.$(evt.target).closest(".stylesheet");
            let stylesheet: IStylesheetModel = tab.data("sass-editor-model");
            this.activateTab(stylesheet, tab);
            
            evt.preventDefault();
        });


        this.code.on("input", (evt: Event) => {
            let code = this.$(evt.target);
            let stylesheet: IStylesheetModel = code.data("sass-editor-model");

            stylesheet.update(code.val());
        });
        
    }


    public createTab(stylesheet: IStylesheetModel) {
        /* Create a tab in the workspace */
        let tab = this.template.clone().removeClass("client-side-template").removeClass("active");
        tab.data("sass-editor-model", stylesheet);

        tab.find("a").text(Workspace.getTabName(stylesheet.href));

        if (Workspace.isSystemStylesheet(stylesheet.href)) {
            /* System stylesheets shouldn't be displayed, so we hide them through CSS */
            tab.addClass("system");
        }

        return tab;
    }



    public activateTab(stylesheet: IStylesheetModel, tab: any) {
        this.workspace.find(".stylesheet.active").removeClass("active");
        tab.addClass("active");

        this.code.data("sass-editor-model", stylesheet);
        this.code.val(stylesheet.getContents());
    }


    private static isSystemStylesheet(href: string) {
        return (
            /* Absolute urls */
            href.startsWith("http://") || href.startsWith("https://") ||

            /* OutSystems-owned modules */
            href.startsWith("/RichWidgets/") ||
            href.startsWith("/ECT_Provider/") ||
            href.startsWith("/EPA_Taskbox/") ||
            href.startsWith("/WebPatterns/") ||
            /* OutSystem widgets - such as the Form widget */
            new RegExp("/[^/]+/Widgets/").test(href) ||

            /* Some third-party modules */
            href.startsWith("/events/") ||

            /* Theme extra css is where the grid classes are defined, it's not possible to edit those */
            new RegExp("/Theme.[^.]+.extra.css").test(href)
        );
    }

    private static getTabName(href: string) {
        var tabNameRegExp = new RegExp("([^/?]+).css(\\?\\d*)?$");
        var match = tabNameRegExp.exec(href);
        if (match) {
            return match[1];
        } else {
            return href;
        }
    }


}