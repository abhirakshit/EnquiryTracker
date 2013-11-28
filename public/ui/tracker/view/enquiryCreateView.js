(function ($) {
	window.app = window.app || { };

	var formInputs = [
	                { name: "firstName", label: "First Name", type: app.inputTypes.TEXT, side: app.side.LEFT },
	                { name: "lastName", label: "Last Name", type: app.inputTypes.TEXT, side: app.side.LEFT },
	                { name: "email", label: "Email", type: app.inputTypes.EMAIL, side: app.side.LEFT },
	                { name: "contactNumber", label: "Phone", type: app.inputTypes.TEXT, side: app.side.LEFT },
	                { name: "followUp", label: "Follow-Up on", type: app.inputTypes.TEXT, side: app.side.LEFT, templateId: "#FormDatePickerInputTemplate"},
	                { name: "address", label: "Address", type: app.inputTypes.TEXT_AREA, side: app.side.LEFT, templateId: "#FormTextAreaInputTemplate"},
	                { name: "servicesInterested", label: "Services Interested", type: app.inputTypes.MULTI_SELECT, side: app.side.LEFT,	
	                	containerId: "serviceAddView", selectionContainerId: "add-service", url: "/service/all", placeholder: "Type service here...", selectionTag: "name"},
	                { name: "countriesInterested", label: "Countries Interested", type: app.inputTypes.MULTI_SELECT, side: app.side.LEFT,
	                	containerId: "countryAddView", selectionContainerId: "add-country", url: "/country/all", placeholder: "Type country here...", selectionTag: "name"},
	                { name: "highSchoolScore", label: "X Score", type: app.inputTypes.TEXT, side: app.side.LEFT },
	                { name: "seniorSecondaryScore", label: "XII Score", type: app.inputTypes.TEXT, side: app.side.LEFT },
	                { name: "graduationScore", label: "Graduation Score", type: app.inputTypes.TEXT, side: app.side.LEFT },
	                { name: "testScores", label: "Test Scores", type: app.inputTypes.TEXT, side: app.side.LEFT },
	                { name: "program", label: "Program", type: app.inputTypes.TEXT, side: app.side.LEFT },
	                { name: "intake", label: "Intake", type: app.inputTypes.TEXT, side: app.side.LEFT},
	                { name: "source", label: "Source", type: app.inputTypes.TEXT, side: app.side.LEFT},
	                
	                //RIGHT
	                { name: "status", label: "Status", type: app.inputTypes.DROP_DOWN, side: app.side.RIGHT, templateId: "#FormDropDownInputTemplate", 
	                	url: "/enquiry/status/all"},
	                { name: "assignedTo", label: "Assigned To", type: app.inputTypes.MULTI_SELECT, side: app.side.RIGHT,
	                	containerId: "assigneeAddView", selectionContainerId: "assign-to", url: "/user/all", placeholder: "Type assignee here...", selectionTag: "fullName"},
	                { name: "remarks", label: "Remarks", type: app.inputTypes.TEXT_AREA, side: app.side.RIGHT, templateId: "#FormTextAreaInputTemplate"},
	                { name: "comments", label: "Comments", type: app.inputTypes.TEXT_AREA, side: app.side.RIGHT, templateId: "#FormTextAreaInputTemplate"},
	                { name: "createEnquiryBtn", label: "Add Enquiry", type: app.inputTypes.SUBMIT, side: app.side.RIGHT, templateId: "#submitBtnTemplate"},
	            ];
	
		
    window.app.EnquiryCreateView = Backbone.View.extend({
    	el: $("#enquiryCreateForm"),
    	template: $("#enquiryCreateFormTemplate").html(),
    	
    	events: {
    		"submit": "submitForm"
    	},
    	
    	
    	initialize: function() {
    		this.collection = new app.FormInputCollection(formInputs);
    		this._multiSelectViewList = [];
			this.render();
		},
		
    	render: function() {
    		Backbone.Validation.bind(this);
    		var tmpl = _.template(this.template);
    		var html = this.$el;
    		html.append(tmpl);
    		var that = this;
    		_.each(this.collection.models, function(formInput){
    			var type = formInput.get('type');
    			var side = formInput.get('side');
    			var templateId = formInput.get('templateId');
    			if (templateId == null)
    				templateId = "#FormTextInputTemplate";
    			var inp;
    			if (app.inputTypes.TEXT === type
    					|| app.inputTypes.EMAIL === type
    					|| app.inputTypes.TEXT_AREA === type
    					|| app.inputTypes.SUBMIT === type) {
    				inp = new app.FormInputView({
    					model: formInput	
    				});
    				html.find("#" + side).append(inp.render(templateId).el);
    			} else if(app.inputTypes.MULTI_SELECT === type) {
    				inp = new app.FormAutoPopulateView({
    					model: formInput
    				})
    				html.find("#" + side).append(inp.render().el);
    				var multiSelectAddView = new app.MultiSelectAddView({
    					parentView: inp,
    					pillContainerId: formInput.get('name'),
    					selectionContainerId: formInput.get('selectionContainerId'),
    					url: formInput.get('url'),
    					selectionTag: formInput.get('selectionTag')
    				});
    				
    				that._multiSelectViewList.push({'name': formInput.get('name'), 'viewObj': multiSelectAddView});
    			} else if(app.inputTypes.DROP_DOWN === type) {
    				inp = new app.FormDropDownView({
    					model: formInput
    				});
    				html.find("#" + side).append(inp.render(templateId).el);
    			} 
    		});
    	},
    	
    	submitForm: function(e) {
    		e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			_.each(this._multiSelectViewList, function(multiSelectView) {
				var name = multiSelectView["name"];
				var ids = _.pluck(multiSelectView["viewObj"].addedOptions.models, 'id');
				data[name] = ids;
			});
			console.log(data);
			this.model.set(data);
		    this.model.save();
		}
    });
    

    // Main
    var newForm = new app.EnquiryModel();
    var enquiryCreateView = new app.EnquiryCreateView({
    	model: newForm
    });
//    var countryAddView = new app.CountryAddView();
    Backbone.history.start();
 
} (jQuery));