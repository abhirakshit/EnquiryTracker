Tracker.module("Sidebar", function(Sidebar, Tracker, Backbone, Marionette, $, _) {

    Sidebar.views.SideBarView = Marionette.ItemView.extend({
        template: "sidebar/views/sidebarTab",
        tagName: "li",

        initialize: function() {
            this.$el.prop("id", this.model.get("id"));
        },

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
            this.trigger("sidebar-navtab:clicked", "Show Module");
        }
    });

    Sidebar.views.SidebarCollection = Marionette.CompositeView.extend({
        template: "sidebar/views/sidebarContainer",
        itemView: Sidebar.views.SideBarView,
        itemViewContainer: "#main-nav",

        initialize: function(){
            var that = this;
            this.on("itemview:sidebar-navtab:clicked", function(childView, msg){
//                console.log("Show Module: " + childView.model.get("id"))
                that.trigger("collectionview:itemview:sidebar-navtab:clicked", childView.model.get("id"));
            });
        },

        unSelectAll: function() {
            this.children.each(function(tab){
                tab.unSelect();
            });
        },

        selectTabView: function(id) {
            this.unSelectAll();
            var tabView = this.children.find(function(tab){
                return tab.model.get('id') == id;
            });

            tabView.select();
        }

    });

});