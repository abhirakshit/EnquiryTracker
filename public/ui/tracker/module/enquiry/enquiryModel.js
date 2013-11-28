window.app = window.app || {};

app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {

    Mod.UserModel = Backbone.Model.extend({
//        urlRoot: Mod.user_Link
    });

    Mod.EnquiryModel = Backbone.Model.extend({
        urlRoot: "/enquiry",

        validation: {
    		firstName: {required: true},
    		email: { required: false, pattern: 'email' },
    		contactNumber: {required: true},
    		followUp: {required: true},
            assignedTo: {required: true}
    	}
    });

    Mod.EnquiryCollection = Backbone.Collection.extend({
        model: Mod.EnquiryModel,

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
                    var assigned = _.findWhere(enquiry.get('assignees'), {id: Mod.loggedUser.id})
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
                    var assigned = _.findWhere(enquiry.get('assignees'), {id: Mod.loggedUser.id})
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
                    var assigned = _.findWhere(enquiry.get('assignees'), {id: Mod.loggedUser.id})
                    if (assigned)
                        return true;
                    else
                        return false
                }
                return false;
            });
        }
    });

    Mod.CommentModel = Backbone.Model.extend({});

    Mod.CommentCollection = Backbone.Collection.extend({
       model: Mod.CommentModel
    });
});