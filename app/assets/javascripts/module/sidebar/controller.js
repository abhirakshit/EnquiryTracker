Tracker.module("Sidebar", function(Sidebar, Tracker, Backbone, Marionette, $, _) {

    Sidebar.SidebarTab = Backbone.Model.extend();
    Sidebar.SidebarNav = Backbone.Collection.extend({
        model: Sidebar.SidebarTab
    });


    Sidebar.NavEnquiriesId = "sidebar-nav-enquiries";
    Sidebar.NavUsersId = "sidebar-nav-users";

    var tabCollection = new Sidebar.SidebarNav([
        new Sidebar.SidebarTab({id: Sidebar.NavEnquiriesId, name:"Enquiries", icon: "icon-home"}),
        new Sidebar.SidebarTab({id: Sidebar.NavUsersId, name:"Users", icon: "icon-user"})
//        new Sidebar.SidebarTab({id: "sidebar-nav-payment", name:"Payment", icon: "icon-barcode"})
    ]);

    Sidebar.onTemplatesLoaded = function() {
        Sidebar.show();
    };

    Sidebar.show = function(){
        Sidebar.sidebarCollection = new this.views.SidebarCollection({
            collection: tabCollection
        });

        this.listenTo(Sidebar.sidebarCollection, "collectionview:itemview:sidebar-navtab:clicked",
            function(tabId){
                if (Sidebar.NavEnquiriesId == tabId) {
                    Sidebar.showEnquiryModule();
                } else if (Sidebar.NavUsersId == tabId) {
                    Sidebar.showUsersModule();
                }
            }
        );
        Tracker.sidebar.show(Sidebar.sidebarCollection);
        Sidebar.activateSidebarTab(Sidebar.NavEnquiriesId);
    };

    Sidebar.showEnquiryModule = function() {
//        Tracker.Enquiry.controller.start();
        Tracker.vent.trigger(Tracker.App.showEnquiryHomeEvt);
        Sidebar.activateSidebarTab(Sidebar.NavEnquiriesId);
    };

    Sidebar.showUsersModule = function() {
//        Tracker.Users.controller.showUsersHome();
        Tracker.vent.trigger(Tracker.App.showUsersHomeEvt);
        Sidebar.activateSidebarTab(Sidebar.NavUsersId);
    };

    Sidebar.activateSidebarTab = function(id) {
        Sidebar.sidebarCollection.selectTabView(id);
    }
});