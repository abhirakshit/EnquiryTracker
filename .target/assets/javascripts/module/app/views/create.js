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
});