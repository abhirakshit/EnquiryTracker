Tracker.module("Header", function(){
    this.prefix = "header";
    this.templatePath = "assets/javascripts/module/";
    this.views = {};
    this.template = function(str) {
        return this.prefix + '-' + str;
    };
});

var dependencies = [
    "module/header/views/header",
    "module/header/controller"

//    // Base
//    "module/app/loader"
];

require(dependencies, function(){
    Tracker.module("Tracker.Header", function(Header, Tracker, Backbone, Marionette, $, _){
        Tracker.addInitializer(function(){
            //Load Templates
            console.log("Init Header...")
            Marionette.ModuleHelper.loadModuleTemplates(Tracker.Header, Tracker.Header.show);
        });
    });
});