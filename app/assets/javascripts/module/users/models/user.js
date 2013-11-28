Tracker.module("Users",function (Users, Tracker, Backbone, Marionette, $, _) {
    Users.Model = Backbone.Model.extend({
//        urlRoot: "/user/json",
        validation: {
            firstName: {required: true},
            email: {required: false, pattern: 'email'},
            password: {required: true},
            reEnterPassword: {required: true},
            roleType: {required: true}
        },

        initialize: function(attributes, options) {
            if (options && options.urlRoot)
                this.urlRoot = options.urlRoot;
        }
    });
});