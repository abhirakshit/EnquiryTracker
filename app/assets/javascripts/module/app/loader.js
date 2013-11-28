Tracker.module("App", function(){
    this.prefix = "app";
    this.templatePath = "assets/javascripts/module/";
    this.views = {};
    this.template = function(str) {
        return this.prefix + '-' + str;
    };
});

var dependencies = [
    //Libs
    "dataTables",
    "dateTimePicker",
    "backboneValidation",
    "backboneSyphon",

    //Models
    "module/app/models/base",
    "module/app/models/multiSelect",

    //Views
    "module/app/views/layouts",
    "module/app/views/pageHeader",
    "module/app/views/create",
    "module/app/views/navTabs",
    "module/app/views/validationMessages",

    //Controller
    "module/app/controller"
];

define(dependencies, function(){
    Tracker.module("App", function(App, Tracker, Backbone, Marionette, $, _){
        Tracker.addInitializer(function(){
            console.log("Init App...")
            Marionette.ModuleHelper.loadModuleTemplates(Tracker.App, Tracker.App.show);
        });
    });
});