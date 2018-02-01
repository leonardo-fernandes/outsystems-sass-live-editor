/// <reference path="IStylesheetModel.ts" />
class AbstractStylesheet {
    constructor(documentModel, href) {
        this.documentModel = documentModel;
        this.href = href;
    }
    getOriginalContents() {
        return this.originalContents;
    }
    getContents() {
        return this.contents;
    }
    update(contents) {
        this.contents = contents;
    }
    import() {
        /* Create a tab in the workspace */
        this.tab = this.documentModel.workspace.createTab(this);
        this.tab.addClass("loading");
        /* Create a <style> element to hold the modified stylesheet */
        this.$style = this.documentModel.addStyle(this);
        this.documentModel.fetch(this.href, (css) => this.load(css), () => this.error());
        return this;
    }
    load(css) {
        this.originalContents = css;
        this.contents = css;
        this.tab.removeClass("loading");
    }
    error() {
        this.tab.removeClass("loading").addClass("error");
    }
}
class DocumentModel {
    constructor($, $window) {
        this.stylesheets = [];
        this.$window = $window;
        this.$document = $window.document;
        this.$$ = $window.$;
        this.workspace = new Workspace($);
        this.initialize();
    }
    initialize() {
        var stylesheets = this.$$("link[rel=stylesheet][href]");
        for (var i = 0; i < stylesheets.length; i++) {
            this.stylesheets.push(new LinkedStylesheet(this, stylesheets.eq(i)).import());
        }
    }
    addStyle(stylesheet) {
        return this.$$("<style></style>").appendTo(this.$$("head"));
    }
    fetch(href, onFetch, onError) {
        this.$$.ajax({
            url: href,
            dataType: "text",
            success: onFetch,
            error: onError
        });
    }
}
/// <reference path="AbstractStylesheet.ts" />
class LinkedStylesheet extends AbstractStylesheet {
    constructor(documentModel, $link) {
        super(documentModel, $link.attr("href"));
    }
}
class Workspace {
    constructor($) {
        this.code = $(".code-column textarea");
        this.workspace = $(".workspace-column .workspace");
        this.template = this.workspace.find(".stylesheet.client-side-template");
        this.initialize();
    }
    initialize() {
        /* Wire up the events */
        this.$("body").on("click", ".workspace .stylesheet a", (evt) => {
            let tab = this.$(evt.target).closest(".stylesheet");
            let stylesheet = tab.data("sass-editor-model");
            this.activateTab(stylesheet, tab);
            evt.preventDefault();
        });
        this.code.on("input", (evt) => {
            let code = this.$(evt.target);
            let stylesheet = code.data("sass-editor-model");
            stylesheet.update(code.val());
        });
    }
    createTab(stylesheet) {
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
    activateTab(stylesheet, tab) {
        this.workspace.find(".stylesheet.active").removeClass("active");
        tab.addClass("active");
        this.code.data("sass-editor-model", stylesheet);
        this.code.val(stylesheet.getContents());
    }
    static isSystemStylesheet(href) {
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
            new RegExp("/Theme.[^.]+.extra.css").test(href));
    }
    static getTabName(href) {
        var tabNameRegExp = new RegExp("([^/?]+).css(\\?\\d*)?$");
        var match = tabNameRegExp.exec(href);
        if (match) {
            return match[1];
        }
        else {
            return href;
        }
    }
}
