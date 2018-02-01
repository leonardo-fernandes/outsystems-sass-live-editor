/// <reference path="DocumentModel.ts" />

interface Window { $: any }
window.$(function() {
    /* Initialize the model based on the opener window */
    new DocumentModel(window, window.opener);
});