window.app = window.app || { };

app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {
    //View: Navigation
    Mod.HeaderTabView = Backbone.Marionette.ItemView.extend({
         template: "#nav-tab",
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

//        onRender: function() {
//            if (this.model.get("isSelected"))
//                this.select();
//        },

        clicked: function(event) {
            event.preventDefault();
            this.trigger("NavTab:Clicked", "Navigate");
            this.select();
        }
     });

    Mod.NavTabCollectionView = Backbone.Marionette.CollectionView.extend({
        itemView: Mod.HeaderTabView,
        tagName: "ul",
        className: "nav nav-tabs",
        initialize: function() {
            var that = this;
            this.on("itemview:NavTab:Clicked", function(childView, msg){
                that.trigger("collectionView:itemview:NavTab:Clicked", childView.model.get("url"));
                that.unSelectAll();
            });
        },

        unSelectAll: function() {
            this.children.each(function(tab){
                tab.unSelect();
            });
        },

        selectTabView: function(linkUrl) {
            var tabView = this.children.find(function(tab){
                return tab.model.get('url') == linkUrl;
            });

            tabView.select();
        },

        appendHtml: function(collectionView, itemView, index){
            collectionView.$el.append(itemView.el);
        }
    });

});