Tracker.module("Enquiry",function (Enquiry, Tracker, Backbone, Marionette, $, _) {
    Enquiry.CommentModel = Backbone.Model.extend({});

    Enquiry.CommentCollection = Backbone.Collection.extend({
        model: Enquiry.CommentModel
    });
});