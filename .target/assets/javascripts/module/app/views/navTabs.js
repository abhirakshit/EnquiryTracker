Tracker.module("App",function (App, Tracker, Backbone, Marionette, $, _) {
    App.views.NavTab = Marionette.ItemView.extend({
        template: "app/views/navTab",
        tagName: "li",

        events: {
            "click": "clicked"
        },

        select: function() {
            this.$el.addClass("active")
        },

        unSelect: function() {
            this.$el.removeClass("active")
        },

        clicked: function(event) {
            event.preventDefault();
            this.trigger("NavTab:Clicked", "Navigate");
        }
    });

    App.HeaderTabCollection = Marionette.CollectionView.extend({
        itemView: App.views.NavTab,
        tagName: "ul",
        className: "nav nav-tabs",
        initialize: function() {
            var that = this;
            this.on("itemview:NavTab:Clicked", function(childView, msg){
                that.trigger("collectionView:itemview:NavTab:Clicked", childView.model.get("url"));
            });
        },

        unSelectAll: function() {
            this.children.each(function(tab){
                tab.unSelect();
            });
        },

        selectTabView: function(linkUrl) {
            this.unSelectAll();
            var tabView = this.children.find(function(tab){
                return tab.model.get('url') == linkUrl;
            });

            tabView.select();
        }
    });

});