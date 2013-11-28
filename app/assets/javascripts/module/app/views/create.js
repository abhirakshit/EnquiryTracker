Tracker.module("App",function (App, Tracker, Backbone, Marionette, $, _) {

    App.views.AddButton = Marionette.ItemView.extend({
        template: "app/views/createButton",
        className: "primaryRightBtn",

        events: {
            "click": "triggerClick"
        },

        triggerClick: function (event) {
            event.preventDefault();
            this.trigger("App.AddButton.Click", this.model);
        }
    });

    App.views.DropDown = Marionette.ItemView.extend({
        className: "controls",
        template: "app/views/form/dropDown",

        initialize: function() {
            this.optionsList = new Tracker.App.MultiSelectCollection([], {
                url: this.model.get('url')
            });
            this.optionsList.fetch({async: false});
//            this.model.set("optionsList", this.optionsList.pluck(this.model.get('name')));
            this.model.set("optionsList", this.optionsList.models);

//            var selected = this.model.get('selected');
//            if (selected) {
//                this.model.set("selected", selected);
//            }
        }
    });
});