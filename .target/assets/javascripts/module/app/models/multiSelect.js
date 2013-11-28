Tracker.module("App",function (App, Tracker, Backbone, Marionette, $, _) {
    App.MultiSelectModel = Backbone.Model.extend({
    });

    App.MultiSelectCollection = Backbone.Collection.extend({
        model: App.MultiSelectModel,

        initialize: function(attributes, options) {
            if (options && options.url)
                this.url = options.url;
        },

        parse: function(response) {
            return response;
        }
    });
});