// loader for Main module
// the 'loader' includes initial module definition and manages the loading
// of all module files including javascript and templates
// this file should be config / boilerplate; keep


// define base module elements; other module files may depend
// on this, but it must not depend on any other module files
Tracker.module("Main", function (Main) {
    Main.prefix = "main";
    Main.templatePath = "assets/javascripts/module/";
    Main.views = {};
    Main.template = function(str) {
        return Main.prefix + '-' + str;
    };

});


// Recommended: define all dependencies for this module
// while you could spread dependency requirements
// over all your module files on purely "as needed" basis,
// this adds to complication of code in your module files
// defining them all, here, has the advantage of limiting use of RequireJS
// to this loader file only

var dependencies = [

    "module/footer/footer",

    "module/users/loader",
    "module/sidebar/loader",
    "module/header/loader",
    "module/enquiry/loader",

    "module/main/controller"
];


// define the loader last. generally, it should depend on all
// module files, otherwise they may not get loaded

define(dependencies,
    function () {
        console.log("Init Main...")
        Tracker.module("Main", function (Main, Tracker, Backbone, Marionette, $, _) {
            Tracker.addInitializer(function () {
                console.log("Start Main...")
                // load templates for this module
                Marionette.ModuleHelper.loadModuleTemplates(Tracker.Main, Tracker.Main.show);

                if (Backbone.history){
                    console.log("Start Backbone history...");
                    Backbone.history.start(
//                {pushState: true}
                    );
                }
            });
        });
    });