window.app = window.app || { };

app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {

    // View Helper
    Mod.dateViewHelper = {
        formatDate: function(date, format) {
            return moment(date).format(format);
        },

        getCurrentDate: function(format) {
            return moment().format(format);
        }
    };

    Mod.PageHeaderView = Backbone.Marionette.ItemView.extend({
        template: "#page-header-template"
    });

	Mod.CreateEnquiryButtonView = Backbone.Marionette.ItemView.extend({
		template: "#button-template",
		className: "primaryRightBtn",

        events: {
            "click #addEnquiry": "showCreateEnquiryForm"
        },

        showCreateEnquiryForm: function (event) {
            event.preventDefault();
//            console.log("Enquiry create btn pressed");
            this.trigger("showEnquiryCreateForm", this.model.get('linkUrl'));
//            Backbone.history.navigate(this.model.attributes.linkUrl, true);
        }
	});
	
	Mod.EnquiryTableHeaderView = Backbone.Marionette.ItemView.extend({
		template: "#header-template"
	});
	
	Mod.RowView = Backbone.Marionette.ItemView.extend({
		 template: "#enquiry-row",
         templateHelpers: Mod.dateViewHelper,
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
	
	Mod.EnquiryTableCompositeView = Backbone.Marionette.CompositeView.extend({
		tagName: "table",
		template: "#enquiry-table",
		itemView: Mod.RowView,
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