/**
 * Created by rabhishe on 10/28/13.
 */

Tracker.module("Enquiry", function(Enquiry, Tracker, Backbone, Marionette, $, _) {

    // View Helper
    Enquiry.dateViewHelper = {
        formatDate: function(date, format) {
            return moment(date).format(format);
        },

        getCurrentDate: function(format) {
            return moment().format(format);
        }
    };


    Enquiry.views.EnquiryTableHeader = Marionette.ItemView.extend({
        template: "enquiry/views/tableHeader"
    });

    Enquiry.views.RowView = Marionette.ItemView.extend({
        template: "enquiry/views/row",
        templateHelpers: Enquiry.dateViewHelper,
        tagName: "tr",
        className: "rowlink",
        serializeData: function(){
            this.data = this.model.toJSON();
            this.data.linkUrl = "enquiry/" + this.data.id;
            return this.data;
        },

        events: {
            "click td": "rowClicked"
        },

        rowClicked: function(event){
            event.preventDefault();
            this.trigger("showEnquiry", this.model);
        }
    });

    Enquiry.views.EnquiryTableCompositeView = Marionette.CompositeView.extend({
        tagName: "table",
        template: "enquiry/views/tableContainer",
        itemView: Enquiry.views.RowView,
        className: "display dataTable table table-striped table-bordered",

        appendHtml: function(compositeView, itemView, index){
            if (this.options.viewClass) {
                itemView.$el.addClass(this.options.viewClass);
            }
            this.listenTo(itemView, "showEnquiry", function(model){
                this.trigger("showEnquiry", model);
            })
            compositeView.$("tbody").append(itemView.el);
        }
    });

});
