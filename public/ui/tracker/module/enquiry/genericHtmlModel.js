window.app = window.app || { };

app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {

    Mod.HeaderModel = Backbone.Model.extend({});
    Mod.ButtonModel = Backbone.Model.extend({});

    // Navigation Tabs
    Mod.NavTab = Backbone.Model.extend({});
    Mod.HeaderTabCollection = Backbone.Collection.extend({
        model: Mod.NavTab
    });
});
