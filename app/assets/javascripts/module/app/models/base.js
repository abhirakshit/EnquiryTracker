Tracker.module("App",function (App, Tracker, Backbone, Marionette, $, _) {
    App.Model = Backbone.Model.extend({
        initialize: function(attributes, options) {
            if (options && options.urlRoot)
                this.urlRoot = options.urlRoot;
        }
    });
});