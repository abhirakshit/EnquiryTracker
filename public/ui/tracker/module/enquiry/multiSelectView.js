window.app = window.app || { };
app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {

   Mod.MultiSelectView = Backbone.Marionette.ItemView.extend({
       tagName: "span",
       className: "autoPopulatePills label label-default",
       template: "#autoPopulatePillTemplate",
       events: {
           "click #remove": "removeItem"
       },

//       initialize: function() {
//           this.selectionTag = this.options.selectionTag;
//       },

//       render: function() {
//           var tmpl = _.template(this.template, {'name': this.model.get(this.selectionTag)});
//           this.$el.append(tmpl);
//           return this;
//
//       },

       removeItem: function() {
           this.remove();
           this.trigger('removed', this.model);
       }
   });

    Mod.MultiSelectInputView = Backbone.Marionette.ItemView.extend({
        initialize: function (){
            console.log("Initialize multi view");
            this.allOptions = new Mod.MultiSelectCollection([], {
                url: this.model.get("url")
            });
            this.allOptions.fetch({async: false});

            this.addedOptions = new Mod.MultiSelectCollection();

//    		this.render();

            this.addedOptions.on("add", this.add, this);
            this.allOptions.on("remove", this.render, this)
            this.allOptions.on("add", this.render, this)

        },

        //Autocomplete
        onRender : function() {
            console.log("On Render multi view");
            var addedOpts = this.addedOptions;
            var allOpts = this.allOptions;
            var selectionTag = this.model.get("selectionTag");
            var optNames = allOpts.pluck(selectionTag);
            optNames.sort();
//			var inp = this.parentView.$el.find("#add-country");
            var inp = this.options.parentView.$el.find("#" + this.model.get("selectionContainerId"));
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
            var view = new Mod.MultiSelectView({
                model: multiSelectModel
//        		selectionTag: this.model.get("selectionTag")
            });

            this.listenTo(view, 'removed', function ( multiSelectModel ) {
                this.remove( multiSelectModel );
            }, this );
            var pillContainer = this.$el.find("#" + this.model.get("pillContainerId"));
            pillContainer.append(view.render().el);
        },

        remove: function(multiSelectModel) {
            this.addedOptions.remove(multiSelectModel);
            this.allOptions.add(multiSelectModel);
        }
    });

    Mod.MultiSelectAddView = Backbone.Marionette.ItemView.extend({
        template: "#formAutoPopulateTemplate",

//    	initialize: function (){
//            console.log("Initialize multi view");
//    		this.allOptions = new Mod.MultiSelectCollection([], {
//    			url: this.model.get("url")
//    		});
//    		this.allOptions.fetch({async: false});
//
//            this.addedOptions = new Mod.MultiSelectCollection();
//
////    		this.render();
//
//    		this.addedOptions.on("add", this.add, this);
//    		this.allOptions.on("remove", this.render, this)
//    		this.allOptions.on("add", this.render, this)
//
//    	},

    	//Autocomplete
		onRender : function() {
            var view = new Mod.MultiSelectInputView({
               model:this.model,
               parentView: this
            });
            this.$el.append(view.render().el);
//            console.log("On Render multi view");
//			var addedOpts = this.addedOptions;
//			var allOpts = this.allOptions;
//			var selectionTag = this.model.get("selectionTag");
//			var optNames = allOpts.pluck(selectionTag);
//			optNames.sort();
////			var inp = this.parentView.$el.find("#add-country");
//			var inp = this.$el.find("#" + this.model.get("selectionContainerId"));
//			inp.autocomplete({
//				source : optNames,
//				minLength : 1,
//				select : function(event, ui) {
//					var props = {};
//					props[selectionTag] = ui.item.value;
////					var selectedModel = allOpts.where({ name : ui.item.value })[0];
//					var selectedModel = allOpts.where(props)[0];
//					addedOpts.add(selectedModel);
//					allOpts.remove(selectedModel);
//					$(this).val('');
//					return false;
//				}
//			});
		},
          
//        add: function(multiSelectModel) {
//        	var view = new Mod.MultiSelectView({
//        		model: multiSelectModel
////        		selectionTag: this.model.get("selectionTag")
//        	});
//
//        	this.listenTo(view, 'removed', function ( multiSelectModel ) {
//        			this.remove( multiSelectModel );
//        			}, this );
//            var pillContainer = this.$el.find("#" + this.model.get("pillContainerId"));
//            pillContainer.append(view.render().el);
//		},
//
//		remove: function(multiSelectModel) {
//			this.addedOptions.remove(multiSelectModel);
//			this.allOptions.add(multiSelectModel);
//		}
    	
    	
    });
});