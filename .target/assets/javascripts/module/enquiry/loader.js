Tracker.module("Enquiry", function(){
    this.prefix = "enquiry";
    this.templatePath = "assets/javascripts/module/";
    this.views = {};
    this.template = function(str) {
        return this.prefix + '-' + str;
    };
});

var dependencies = [
    //TODO: Libs, where should these go?
//    "dataTables",
//    "dateTimePicker",
//    "backboneValidation",
//    "backboneSyphon",

    //Models
    "module/enquiry/models/enquiry",
    "module/enquiry/models/comment",
//    "module/enquiry/models/multiSelect",

    //Layouts
    "module/enquiry/views/layouts/layouts",
    "module/enquiry/views/layouts/formMultiSelectLayout",

    //Views
    "module/enquiry/views/enquiryHome",
    "module/enquiry/views/create",
    "module/enquiry/views/show",
//    "module/enquiry/views/navTabs",
    "module/enquiry/views/formMultiSelect",

    //Controller
    "module/enquiry/controller",

//    // Base
    "module/app/loader"
]


require(dependencies, function(){
   Tracker.module("Enquiry", function(Enquiry, Tracker, Backbone, Marionette, $, _){
       Tracker.addInitializer(function(){
           //Load Templates
           console.log("Init Enquiry...")
           Marionette.ModuleHelper.loadModuleTemplates(Tracker.Enquiry, Tracker.Enquiry.start);
       });
   });
});