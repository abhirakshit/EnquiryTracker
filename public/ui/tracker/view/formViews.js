(function ($) {
	window.app = window.app || { };
	
	window.app.inputTypes = {
			TEXT: "text",
			EMAIL: "email",
			TEXT_AREA: "textarea",
			MULTI_SELECT: "multi_select",
			DROP_DOWN: "drop_down",
			SUBMIT: "submit"
			
	};
	
	window.app.side = {
			LEFT: "left",
			RIGHT: "right"
	}
	
	window.app.FormTextAreaInputView = Backbone.View.extend({
		model: app.FormInputModel,
		className: "control-group",
		template: $("#FormTextAreaInputTemplate").html(),
		
		render: function(){
			var tmpl = _.template(this.template, {name: this.model.get('name'), label: this.model.get('label')});
			this.$el.append(tmpl);
			return this;
		}
	});
	
	
	window.app.FormDropDownView = Backbone.View.extend({
		model: app.FormInputModel,
		className: "control-group",
		
		initialize: function() {
			this.optionsList = new app.MultiSelectCollection([], {
    			url: this.model.get('url')
    		});
			this.optionsList.fetch({async: false});
		},
		
		render: function(templateId){
			var template = $(templateId).html();
			var tmpl = _.template(template, {name: this.model.get('name'), 
				label: this.model.get('label'),
				optionsList: this.optionsList.pluck(this.model.get('name'))
				});
			this.$el.append(tmpl);
			return this;
		}
	});
	
	window.app.FormInputView = Backbone.View.extend({
		model: app.FormInputModel,
		className: "control-group",
//		template: $("#FormTextInputTemplate").html(),
		
		render: function(templateId){
//			if (templateId == null)
//				templateId = "#FormTextInputTemplate";
			var template = $(templateId).html();
			var tmpl = _.template(template, {name: this.model.get('name'), label: this.model.get('label')});
			this.$el.append(tmpl);
			return this;
		}
	});
	
	window.app.FormAutoPopulateView = Backbone.View.extend({
		model: app.FormInputModel,
		className: "control-group",
		template: $("#FormAutoPopulate").html(),
		
		render: function(){
			var tmpl = _.template(this.template, {name: this.model.get('name'), label: this.model.get('label'),
				containerId: this.model.get('containerId'), selectionContainerId: this.model.get('selectionContainerId'),
				placeholder: this.model.get('placeholder')});
			this.$el.append(tmpl);
			return this;
		}
	});

	
} (jQuery));