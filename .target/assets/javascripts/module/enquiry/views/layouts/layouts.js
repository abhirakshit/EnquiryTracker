/**
 * Created by rabhishe on 10/28/13.
 */

Tracker.module("Enquiry",function (Enquiry, Tracker, Backbone, Marionette, $, _) {
    Enquiry.views.DatedEnquiriesLayout = Marionette.Layout.extend({
        template: "enquiry/views/layouts/datedEnquiryLayout",

        regions: {
            pendingHeader: "#pending-header",
            pendingRegion: "#pending-enquiries",
            todaysRegion: "#todays-enquiries",
            todaysHeader: "#todays-header",
            futureRegion: "#future-enquiries",
            futureHeader: "#future-header"
        }
    });

    var allEnquiriesLayoutHtml = '<div id="enquiry-table-header"></div><div id="enquiry-table-region" class="tableDiv"></div>';
    Enquiry.AllEnquiriesLayout = Marionette.Layout.extend({
//        template: "#enquiries-all",

        template: function(serialized_model) {
//            return _.template(allEnquiriesLayoutHtml, {}, {variable: 'args'});
            return _.template(allEnquiriesLayoutHtml);
        },

        regions: {
            enquiryTableHeader: "#enquiry-table-header",
            enquiryTableRegion: "#enquiry-table-region"
        }
    });

//    Enquiry.CreateEnquiryFormLayout = Marionette.Layout.extend({
//        template : "#enquiry-create-form",
//
//        regions: {
//            personalInfoRegion: "#personal",
//            academicsRegion: "#academics",
//            servicesRegion: "#services",
//            commentsRegion: "#comments",
//            submitEnquiryRegion: "#submit"
//        }
//    })
});