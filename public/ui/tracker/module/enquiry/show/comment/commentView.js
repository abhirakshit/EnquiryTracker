window.app = window.app || { };

app.Tracker.module("EnquiryModule",function (EnquiryMod, Tracker, Backbone, Marionette, $, _) {

    EnquiryMod.CommentView = Backbone.Marionette.ItemView.extend({
        template: "#commentItemViewTemplate",
        className: "comment-container",

        initialize: function(){
            var createdOn = moment(this.model.get('createdOn')).format("ddd, MMM Do, hh:mm a");
            var creatorName = this.model.get('creatorName');
            var creationInfo = "<b>" + createdOn + "</b> [<i>" + creatorName + "</i>]: ";
            this.model.set('creationInfo', creationInfo);
        }
    });

    EnquiryMod.CommentHistoryView = Backbone.Marionette.CompositeView.extend({
        template: "#historyViewTemplate",
        itemView: EnquiryMod.CommentView,
        itemViewContainer: "#comments",
        className: "control-group"
    });

});