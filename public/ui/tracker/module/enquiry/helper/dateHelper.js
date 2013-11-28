window.app = window.app || { };

app.Tracker.module("EnquiryModule",function (EnquiryMod, TrackerApp, Backbone, Marionette, $, _) {

    // View Helper
    EnquiryMod.dateViewHelper = {
        formatDate: function(date, format) {
            return moment(date).format(format);
        },

        getCurrentDate: function(format) {
            return moment().format(format);
        }
    };
});