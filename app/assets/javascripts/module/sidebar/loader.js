
Tracker.module("Sidebar", function(){
    this.prefix = "sidebar";
    this.templatePath = "assets/javascripts/module/";
    this.views = {};
    this.template = function(str) {
        return this.prefix + '-' + str;
    };
});

var dependencies = [
    "module/sidebar/views/sidebarTab",
    "module/sidebar/controller",

    //Base
    "module/app/loader"
];

require(dependencies, function(){
    Tracker.module("Sidebar", function(Sidebar, Tracker, Backbone, Marionette, $, _){
        Tracker.addInitializer(function(){
            //Load Templates
            console.log("Load Sidebar...")
            Marionette.ModuleHelper.loadModuleTemplates(Tracker.Sidebar, Tracker.Sidebar.show);
        });
    });
});

