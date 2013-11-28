Tracker.module("Users",function (Users, Tracker, Backbone, Marionette, $, _) {
    Users.Model = Backbone.Model.extend({
//        urlRoot: "/user/json",

        initialize: function(attributes, options) {
            if (options && options.urlRoot)
                this.urlRoot = options.urlRoot;
        }
    });
});