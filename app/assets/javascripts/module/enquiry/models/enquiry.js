Tracker.module("Enquiry",function (Enquiry, Tracker, Backbone, Marionette, $, _) {
    Enquiry.EnquiryModel = Backbone.Model.extend({
        urlRoot: "/enquiry",

        validation: {
            firstName: {required: true},
            email: { required: false, pattern: 'email' },
            contactNumber: {required: true},
            followUp: {required: true},
            assignedTo: {required: true}
        }
    });

    Enquiry.EnquiryCollection = Backbone.Collection.extend({
        model: Enquiry.EnquiryModel,

        initialize: function(attributes, options) {
            if (options && options.url)
                this.url = options.url
        },

        parse: function(response) {
            return response;
        },

        getPendingEnquiries: function() {
            return _.filter(this.models, function(enquiry){
                var followUp = enquiry.get("followUp");
                return moment().isAfter(followUp, "day");
            });

        },

        getTodaysEnquiries: function() {
            return _.filter(this.models, function(enquiry){
                var followUp = enquiry.get("followUp");
                return moment().isSame(followUp, "day");
            });
        },

        getFutureEnquiries: function() {
            return _.filter(this.models, function(enquiry){
                var followUp = enquiry.get("followUp");
                return moment().isBefore(followUp, "day");
            });
        },

        getClosedEnquiries: function() {
            return _.filter(this.models, function(enquiry){
                return "Closed" == enquiry.get("status") ;
            });
        },

        getJoinedEnquiries: function() {
            return _.filter(this.models, function(enquiry){
                return "Joined" == enquiry.get("status") ;
            });
        },


        getMyPendingEnquiries: function() {
            return _.filter(this.models, function(enquiry){
                var followUp = enquiry.get("followUp");
                if (moment().isAfter(followUp, "day")) {
                    var assigned = _.findWhere(enquiry.get('assignees'), {id: Tracker.App.loggedUser.id})
                    if (assigned)
                        return true;
                    else
                        return false
                }
                return false;
            });
        },

        getMyTodaysEnquiries: function() {
            return _.filter(this.models, function(enquiry){
                var followUp = enquiry.get("followUp");
                if (moment().isSame(followUp, "day")) {
                    var assigned = _.findWhere(enquiry.get('assignees'), {id: Tracker.App.loggedUser.id})
                    if (assigned)
                        return true;
                    else
                        return false
                }
                return false;
            });
        },

        getMyFutureEnquiries: function() {
            return _.filter(this.models, function(enquiry){
                var followUp = enquiry.get("followUp");
                if (moment().isBefore(followUp, "day")) {
                    var assigned = _.findWhere(enquiry.get('assignees'), {id: Tracker.App.loggedUser.id})
                    if (assigned)
                        return true;
                    else
                        return false
                }
                return false;
            });
        }
    });
});