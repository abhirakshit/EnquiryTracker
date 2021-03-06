// loader for Main module
// the 'loader' includes initial module definition and manages the loading
// of all module files including javascript and templates
// this file should be config / boilerplate; keep


// define base module elements; other module files may depend
// on this, but it must not depend on any other module files
Tracker.module("Main", function (Main) {
    Main.prefix = "main";
    Main.templatePath = "module";
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
//    "modules/main/controller",
//    "modules/main/views/header/header",
    "module/footer/footer",
//    "modules/main/views/body/body"
];


// define the loader last. generally, it should depend on all
// module files, otherwise they may not get loaded
define(dependencies,
    function () {
        Tracker.module("Main", function (Main, Tracker, Backbone, Marionette, $, _) {


            Tracker.addInitializer(function () {
                // load templates for this module
                Marionette.ModuleHelper.loadModuleTemplates(Tracker.Main, Tracker.Main.show);
            });
        });
    });