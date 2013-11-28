(function ($) {
	window.app = window.app || { };
	
	var tabs = [
	            {label: "My Enquiries", url: "/user/home"},
	            {label: "All Enquiries", url: "/enquiry/all"}
	            ];
	
	 window.app.UserDashboardView = Backbone.View.extend({
		template:  $("#home-my-enquiries").html(), 
		initialize: function() {
			this.render();
		},
		
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.append(tmpl);
			
			var navBarView = new app.NavBarTabsView(tabs);
			this.$el.find("#nav-bar").append(navBarView.render().el);
			return this;
		}
	 
	 });
	 
	 
	 window.app.NavBarTabsView = Backbone.View.extend({
		 tagName: "ul",
//		 el: $("#nav-bar"),
		 template: $("#nav-tab").html(),
		
		 initialize: function() {
			},
			
		
		render: function() {
			var _template = this.template;
			var _html = this.$el; 
				_.each(this.options, function(tab) {
					var label = tab["label"];
					var tmpl = _.template(_template, {label: tab["label"], url: tab["url"]});
					_html.append(tmpl);
				});
				
				return this;
			}
		 
	 });
	 
	
} (jQuery));	