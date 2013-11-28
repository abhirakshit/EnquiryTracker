Tracker.module("App", function(App, Tracker, Backbone, Marionette, $, _) {

    App.allUsers_Url = "/user/all";
    App.user_Link = "/user/json";
    App.updateLoggedUser = function() {
        //Get local user
        var options = {urlRoot: App.user_Link};
        App.loggedUser = new App.Model([], options);
        App.loggedUser.fetch({async : false});
    };

    App.onTemplatesLoaded = function() {
        App.show();
    };

    App.show = function(){
        console.log("Show App...");
        App.updateLoggedUser();
    };

    App.showUsersHomeEvt = "showUsersHome";
    App.showEnquiryHomeEvt = "showEnquiryHome";
    Tracker.vent.on('all', function (evt, model) {
//        console.log('Tracker DEBUG: Event Caught: ' + evt);
//        if (model) {
//            console.dir(model);
//        }

        if (App.showEnquiryHomeEvt == evt){
            Tracker.Enquiry.controller.start();
        } else if (App.showUsersHomeEvt) {
            Tracker.Users.controller.showUsersHome();
        }

    });



    App.addDataTables = function(layout) {
        //AddDataTables - Sorting, Filter etc
        layout.$el.find('.dataTable').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bInfo": false
        });
    };
});