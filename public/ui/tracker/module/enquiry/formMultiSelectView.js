window.app = window.app || { };
app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {

    Mod.MultiSelectInputView = Backbone.Marionette.ItemView.extend({
        template: "#multiSelectInputViewTemplate",

        initialize: function() {
//            console.log("Initialize multi view");
            if (this.model.get("allOptions")) {
                this.allOptions = this.model.get("allOptions")
            } else {
                this.allOptions = new Mod.MultiSelectCollection([], {
                    url: this.model.get("url")
                });
                this.allOptions.fetch({async: false});
            }

            this.addedOptions = new Mod.MultiSelectCollection();
            this.addedOptions.on("add", this.add, this);
            this.allOptions.on("remove", this.render, this);
            this.allOptions.on("add", this.render, this);
        },

        onRender: function(){
//            console.log("On Render multi view");
            var addedOpts = this.addedOptions;
            var allOpts = this.allOptions;
            var selectionTag = this.model.get("selectionTag");
            var optNames = allOpts.pluck(selectionTag);
            optNames.sort();
            var inp = this.$el.find("#" + this.model.get("selectionContainerId"));
            this.optionsList = inp.autocomplete({
                source : optNames,
                minLength : 1,
                select : function(event, ui) {
                    var props = {};
                    props[selectionTag] = ui.item.value;
                    var selectedModel = allOpts.where(props)[0];
                    addedOpts.add(selectedModel);
                    allOpts.remove(selectedModel);

                    // To make the selection box empty again
                    $(this).val('');
                    return false;
                }
            });

//            this.prePopulate();
        },

        //SHOULD BE CALLED ONCE
        prePopulate: function() {
            var selectedNames = this.model.get("selectedNames");
            if (selectedNames) {
                var that = this;
                _.each(selectedNames, function(toAdd){
                    var model = _.find(that.allOptions.models, function(mod) {
                        return mod.get("name") == toAdd.trim();
                    })
                    if (model) {
                        that.addedOptions.add(model);
                        that.allOptions.remove(model);
                    } else {
                        console.error("Did not find model for name: " + toAdd);
                    }
                })

                // So that it doesnt populate again when onRender is called
                this.model.set("selectedNames", null);
            }
        },

        add: function(multiSelectModel) {
            this.trigger("msInpView:add", multiSelectModel);
        },

        remove: function(multiSelectModel) {
            this.addedOptions.remove(multiSelectModel);
            this.allOptions.add(multiSelectModel);
        }
    })

    Mod.PillContainerView = Backbone.Marionette.ItemView.extend({
        template: "#pillContainerView",
        onRender: function(){
            this.$el.addClass("autoPopulatePillContainer");
        }
    })

    Mod.FormMultiSelectLayout = Backbone.Marionette.Layout.extend({
        template: "#formMultiSelectRegionTemplate",

        initialize: function(){
            this.selectedModelIdList = [];
        },

        regions: {
          pillContainerRegion: "#pillContainerRegion",
          inputRegion: "#inputRegion"
        },

        onRender: function(){
            var autoPillView = new Mod.PillContainerView({
                model: this.model
            });

            var inputView = new Mod.MultiSelectInputView({
                model: this.model
            });


            this.listenTo(inputView, "msInpView:add", function(multiSelectModel){
                var view = new Mod.MultiSelectView({
                    model: multiSelectModel
                });

                this.listenTo(view, 'removed', function ( multiSelectModel ) {
                    this.selectedModelIdList = _.without(this.selectedModelIdList, multiSelectModel.id);
                    inputView.remove( multiSelectModel );
                });

                autoPillView.$el.append(view.render().el);
                this.selectedModelIdList.push(multiSelectModel.id);
            });

            this.pillContainerRegion.show(autoPillView);
            this.inputRegion.show(inputView);
            inputView.prePopulate();
        }

    });


    Mod.FormDropDownView = Backbone.Marionette.ItemView.extend({
        className: "control-group",
        template: "#formDropDownInputTemplate",

        initialize: function() {
            this.optionsList = new Mod.MultiSelectCollection([], {
                url: this.model.get('url')
            });
            this.optionsList.fetch({async: false});
            this.model.set("optionsList", this.optionsList.pluck(this.model.get('name')));

            var selected = this.model.get('selected');
            if (selected) {
                this.model.set("selected", selected);
            }
        }
    });

})