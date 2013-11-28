Tracker.module("Enquiry",function (Enquiry, Tracker, Backbone, Marionette, $, _) {

    var commentHtml = '<span id="creationInfo"><%=args.creationInfo%></span><span id="comment"><%=args.comment%></span>'
    Enquiry.Comment = Marionette.ItemView.extend({
//        template: "#commentItemViewTemplate",
        template: function(serialized_model) {
            return _.template(commentHtml,
                {creationInfo: serialized_model.creationInfo,
                 comment: serialized_model.comment},
                {variable: 'args'});
        },
        className: "comment-container",

        initialize: function(){
            var createdOn = moment(this.model.get('createdOn')).format("ddd, MMM Do, hh:mm a");
            var creatorName = this.model.get('creatorName');
            var creationInfo = "<b>" + createdOn + "</b> [<i>" + creatorName + "</i>]: ";
            this.model.set('creationInfo', creationInfo);
        }
    });


    var historyViewHtml = '<legend>History</legend> <div id="comments"></div>'
    Enquiry.CommentHistoryView = Marionette.CompositeView.extend({
//        template: "#historyViewTemplate",
        template: function(serialized_model) {
//            return _.template(historyViewHtml, {}, {variable: 'args'});
            return _.template(historyViewHtml);
        },
        itemView: Enquiry.Comment,
        itemViewContainer: "#comments",
        className: "control-group"
    });
});