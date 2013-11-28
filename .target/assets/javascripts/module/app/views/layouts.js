Tracker.module("App",function (App, Tracker, Backbone, Marionette, $, _) {
// Layouts
    App.views.MainLayout = Marionette.Layout.extend({
        template: "app/views/layouts/mainLayout",

        regions: {
            pageHeaderRegion: "#page-header",
            navigationTabsRegion: "#nav-tabs",
            tabContentRegion: "#tab-content"
        }
    });

    App.views.HeaderLayout = Marionette.Layout.extend({
        template: "app/views/layouts/headerLayout",

        regions: {
            pageHeader: "#page-header",
            addEnquiryBtn: "#add-enquiry-btn"
        }
    });
});