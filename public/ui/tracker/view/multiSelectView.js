(function ($) {
	window.app = window.app || { };
	
    window.app.MultiSelectView = Backbone.View.extend({
    	tagName: "span",
    	className: "autoPopulatePills label label-default",	
    	template: $("#autoPopulatePillTemplate").html(),
    	
    	events: {
    		"click #remove": "remove"
    	},
    	
    	initialize: function() {
    		this.selectionTag = this.options.selectionTag;
		},
    	
    	render: function() {
			var tmpl = _.template(this.template, {'name': this.model.get(this.selectionTag)});
			this.$el.append(tmpl);
			return this;
			
		},
    	
    	remove: function() {
    		this.trigger('removed', this.model);
	 	    this.remove();
	 	    
    	},  
    });

    window.app.MultiSelectAddView = Backbone.View.extend({
    	initialize: function (){
    		this.parentView = this.options.parentView;
    		this.selectionContainerId = this.options.selectionContainerId;
    		this.pillContainerId = this.options.pillContainerId;
    		this.url = this.options.url;
    		this.selectionTag = this.options.selectionTag;
    		
    		this.allOptions = new app.MultiSelectCollection([], {
    			url: this.url
    		});
    		this.addedOptions = new app.MultiSelectCollection();
    		this.allOptions.fetch({async: false});

    		this.render();
    		
    		this.addedOptions.on("add", this.add, this);
    		this.allOptions.on("remove", this.render, this)
    		this.allOptions.on("add", this.render, this)
    		
    	},
    	
    	
    	//Autocomplete
		render : function() {
			var addedOpts = this.addedOptions;
			var allOpts = this.allOptions;
			var selectionTag = this.selectionTag
			var optNames = allOpts.pluck(selectionTag);
			optNames.sort();
//			var inp = this.parentView.$el.find("#add-country");
			var inp = this.parentView.$el.find("#" + this.selectionContainerId);
			inp.autocomplete({
				source : optNames,
				minLength : 1,
				select : function(event, ui) { 
					var props = {};
					props[selectionTag] = ui.item.value;
//					var selectedModel = allOpts.where({ name : ui.item.value })[0];
					var selectedModel = allOpts.where(props)[0];
					addedOpts.add(selectedModel);
					allOpts.remove(selectedModel);
					$(this).val(''); 
					return false;
				}
			});
		},
          
        add: function(multiSelectModel) {
        	var view = new app.MultiSelectView({
        		model: multiSelectModel,
        		selectionTag: this.selectionTag
        	});
        	
        	this.listenTo(view, 'removed', function ( multiSelectModel ) {
        			this.remove( multiSelectModel );
        			}, this );
        	this.parentView.$el.find("#" + this.pillContainerId).append(view.render().el);
		}, 
		
		remove: function(multiSelectModel) {
			this.addedOptions.remove(multiSelectModel);
			this.allOptions.add(multiSelectModel);
		}
    	
    	
    });
} (jQuery));