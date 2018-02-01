/// <reference path="AbstractStylesheet.ts" />

class LinkedStylesheet extends AbstractStylesheet {

    public constructor(documentModel: DocumentModel, $link: any) {
        super(documentModel, $link.attr("href"));
    }

}