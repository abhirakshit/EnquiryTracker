window.app = window.app || { };

app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {
// Layouts
    Mod.MainLayout = Backbone.Marionette.Layout.extend({
        template: "#page-content",

        regions: {
            pageHeaderRegion: "#page-header",
            navigationTabsRegion: "#nav-tabs",
            tabContentRegion: "#tab-content"
        }
    });

    Mod.EnquiryHeaderLayout = Backbone.Marionette.Layout.extend({
        template: "#enquiry-header-template",

        regions: {
            pageHeader: "#page-header",
            addEnquiryBtn: "#add-enquiry-btn"
        }
    });

    Mod.DatedEnquiriesLayout = Backbone.Marionette.Layout.extend({
        template: "#enquiry-dated",

        regions: {
            pendingHeader: "#pending-header",
            pendingRegion: "#pending-enquiries",
            todaysRegion: "#todays-enquiries",
            todaysHeader: "#todays-header",
            futureRegion: "#future-enquiries",
            futureHeader: "#future-header"
        }
    });

    Mod.AllEnquiriesLayout = Backbone.Marionette.Layout.extend({
        template: "#enquiries-all",

        regions: {
            enquiryTableHeader: "#enquiry-table-header",
            enquiryTableRegion: "#enquiry-table-region"
        }
    });

    Mod.CreateEnquiryFormLayout = Backbone.Marionette.Layout.extend({
        template : "#enquiry-create-form",

        regions: {
            personalInfoRegion: "#personal",
            academicsRegion: "#academics",
            servicesRegion: "#services",
            commentsRegion: "#comments",
            submitEnquiryRegion: "#submit"
        }
    })
});