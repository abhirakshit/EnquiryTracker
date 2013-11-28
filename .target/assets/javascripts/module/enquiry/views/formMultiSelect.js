Tracker.module("Enquiry",function (Enquiry, Tracker, Backbone, Marionette, $, _) {

    var autoPopulatePillHtml = '<%=args.name%><i class="icon-remove-sign" title="Remove <%=args.name%>" id="remove"></i>'
    Enquiry.MultiSelectView = Marionette.ItemView.extend({
        tagName: "span",
        className: "autoPopulatePills label label-default",

//        template: "#autoPopulatePillTemplate",
        template: function(serialized_model) {
            return _.template(autoPopulatePillHtml,
                {name: serialized_model.name},
                {variable: 'args'});
        },

        events: {
            "click #remove": "removeItem"
        },

        removeItem: function() {
            this.remove();
            this.trigger('removed', this.model);
        }
    });


    var multiSelectInpHtml = '<input type="text" placeholder="<%=args.placeholder%>" id="<%=args.selectionContainerId%>"/>';
    Enquiry.MultiSelectInputView = Marionette.ItemView.extend({
        template: function(serialized_model) {
            return _.template(multiSelectInpHtml,
                {placeholder: serialized_model.placeholder,
                selectionContainerId: serialized_model.selectionContainerId},
                {variable: 'args'});
        },

        initialize: function() {
//            console.log("Initialize multi view");
            if (this.model.get("allOptions")) {
                this.allOptions = this.model.get("allOptions")
            } else {
                this.allOptions = new Tracker.App.MultiSelectCollection([], {
                    url: this.model.get("url")
                });
                this.allOptions.fetch({async: false});
            }

            this.addedOptions = new Tracker.App.MultiSelectCollection();
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
                    var model = _.find(that.allOptions.models, function(model) {
                        return model.get("name") == toAdd.trim();
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

    Enquiry.PillContainerView = Marionette.ItemView.extend({
//        template: "#pillContainerView",
        template: function(serialized_model) {
            return _.template("", {}, {variable: 'args'});
        },
        onRender: function(){
            this.$el.addClass("autoPopulatePillContainer");
        }
    })

    Enquiry.views.FormDropDownView = Marionette.ItemView.extend({
        className: "control-group",
        template: "enquiry/views/form/dropDown",

        initialize: function() {
            this.optionsList = new Tracker.App.MultiSelectCollection([], {
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