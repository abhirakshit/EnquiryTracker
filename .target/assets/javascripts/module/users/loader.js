Tracker.module("Users", function () {
    this.prefix = "users";
    this.templatePath = "assets/javascripts/module/";
    this.views = {};
    this.template = function (str) {
        return this.prefix + '-' + str;
    };
});

var dependencies = [
    //Models
    "module/users/models/user",

    //Views
    "module/users/views/usersHome",

    //Controller
    "module/users/controller",

    // Base
    "module/app/loader"
];

require(dependencies, function () {
    Tracker.module("Users", function (Users, Tracker, Backbone, Marionette, $, _) {
        Tracker.addInitializer(function () {
            //Load Templates
            console.log("Init Users...")
            Marionette.ModuleHelper.loadModuleTemplates(Tracker.Users, Tracker.Users.show);
//            Users.show();
        });
    });
});
