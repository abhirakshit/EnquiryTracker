/**
 * Created by rabhishe on 10/28/13.
 */
Tracker.module("Enquiry", function(Enquiry, Tracker, Backbone, Marionette, $, _) {

    //=====================================
    // Static variables
    //=====================================

    Enquiry.enquiryHome_Link = "";
    Enquiry.enquiryMy_Link = "#enquiry/my";
    Enquiry.enquiryAll_Link = "#enquiry/all";
    Enquiry.enquiryAllByDate_Link = "#enquiry/allByDate";
    Enquiry.enquiryJoined_Link = "#enquiry/joined";
    Enquiry.enquiryClosed_Link = "#enquiry/closed";

    //Server urls (Convert to use play routes)
    Enquiry.allEnquiries_Url = "/all/enquiry";
//    Enquiry.allUsers_Url = "/user/all";

    Enquiry.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "enquiry":  "showEnquiryHome",
//            "user":  "showEnquiryHome",
//            "user/addEnquiry": "showCreateEnquiryForm",//Remove

            "enquiry/add": "showCreateEnquiryForm",

            "enquiry/all": "showAllEnquiries",
            "enquiry/allByDate": "showAllEnquiriesByDate",
            "enquiry/my" : "showMyEnquiries",
            "enquiry/joined": "showAllJoinedEnquiries",
            "enquiry/closed": "showAllClosedEnquiries",
            "enquiry/:id": "showEnquiryById"

        }
    });
    
    this.start = function() {

        Enquiry.controller = new Enquiry.Controller({
//            toolItems: options.toolItems,
            //we pass in the region from the app because it will be
            //converted into a Marionette.Region for us
            region: Tracker.pageContent
        });

        Enquiry.mainRouter = new Enquiry.Router({
            controller: Enquiry.controller
        });

        //Load home page
        Enquiry.controller.start();
    };

    this.onTemplatesLoaded = function() {
        this.start();
    };

    Enquiry.Controller = Marionette.Controller.extend({
        initialize: function (options) {
            //TODO: FIX THIS, DONT DELETE
//            _.bindAll(this, _.functions(this));
            this.region = options.region;
            console.log('EnquiryTrackerModule:Controller:initialize');

            //Populate Collections
            this.fetchAllEnquiryCollection();
//            this.updateAllUsersCollection();
            this.updateAllDatedEnquiryCollections();
        },

        start: function() {
//            Enquiry.mainLayout = new Enquiry.views.MainLayout();
            Enquiry.mainLayout = new Tracker.App.views.MainLayout();
            this.region.show(Enquiry.mainLayout);

            //Show
            Enquiry.addPageHeader();
            Enquiry.addNavTabs();
            this.showEnquiryHome();
//            this.showAllEnquiriesByDate();
        },

        fetchAllEnquiryCollection: function() {
            Enquiry.allEnquiries = new Enquiry.EnquiryCollection([], {url: Enquiry.allEnquiries_Url});
            Enquiry.allEnquiries.fetch({async : false});
        },

//        updateAllUsersCollection: function() {
//            Enquiry.allUsers = new Enquiry.MultiSelectCollection([], {url: Tracker.App.allUsers_Url});
//            Enquiry.allUsers.fetch({async: false});
//        },

        updateAllDatedEnquiryCollections: function() {
            this.updateDatedEnquiryCollections(Enquiry.allEnquiries.getPendingEnquiries(),
                Enquiry.allEnquiries.getTodaysEnquiries(),
                Enquiry.allEnquiries.getFutureEnquiries());
        },

        updateMyDatedEnquiryCollections: function() {
            this.updateDatedEnquiryCollections(Enquiry.allEnquiries.getMyPendingEnquiries(),
                Enquiry.allEnquiries.getMyTodaysEnquiries(),
                Enquiry.allEnquiries.getMyFutureEnquiries());
        },

        updateDatedEnquiryCollections: function(pending, today, future) {
            Enquiry.pendingEnq = new Enquiry.EnquiryCollection(pending);
            Enquiry.todaysEnq = new Enquiry.EnquiryCollection(today);
            Enquiry.futureEnq = new Enquiry.EnquiryCollection(future);
        },


        showAllEnquiriesByDate: function() {
            this.updateAllDatedEnquiryCollections();
            Enquiry.showDefaultDatedEnquiryRegion(Enquiry.enquiryAllByDate_Link);
        },

        showAllEnquiries: function() {
            Enquiry.displayEnquiryRegion(Enquiry.allEnquiries, Enquiry.enquiryAll_Link);
        },

        showMyEnquiries: function() {
            this.updateMyDatedEnquiryCollections();
            Enquiry.showDefaultDatedEnquiryRegion(Enquiry.enquiryMy_Link)
        },

        showAllClosedEnquiries: function() {
            Enquiry.displayEnquiryRegion(new Enquiry.EnquiryCollection(Enquiry.allEnquiries.getClosedEnquiries()), Enquiry.enquiryClosed_Link);
        },

        showAllJoinedEnquiries: function() {
            Enquiry.displayEnquiryRegion(new Enquiry.EnquiryCollection(Enquiry.allEnquiries.getJoinedEnquiries()), Enquiry.enquiryJoined_Link);
        },

        showEnquiryById: function(id) {
            if (!Enquiry.allEnquiries || _.size(Enquiry.allEnquiries) == 0)
                this.fetchAllEnquiryCollection();

            var enquiry = _.find(Enquiry.allEnquiries.models, function(enq){
                return enq.id == id
            });

            Enquiry.showCreateEnquiryForm(enquiry, true);
        },

        showEnquiry: function(enquiryModel){
            Enquiry.showCreateEnquiryForm(enquiryModel, true)
        },

        showCreateEnquiryForm: function(){
            Enquiry.showCreateEnquiryForm();
        },

        showEnquiryHome: function() {
            Enquiry.showDefaultDatedEnquiryRegion(Enquiry.enquiryAllByDate_Link);
        },

        addModelToCollection: function(enquiryModel) {
            Enquiry.allEnquiries.add(enquiryModel);
        }
    });

    Enquiry.displayEnquiryRegion = function(enquiries, tabLink) {
        Enquiry.allEnqLayout = new Enquiry.AllEnquiriesLayout();
        Enquiry.mainLayout.tabContentRegion.show(Enquiry.allEnqLayout);

        if (_.size(enquiries) > 0) {
            Enquiry.allEnqLayout.enquiryTableRegion.show(this.setTableBodyView({
                collection: enquiries
            }));
        }
        Tracker.App.addDataTables(Enquiry.allEnqLayout);
        Enquiry.navTabCollection.selectTabView(tabLink);
        Enquiry.mainRouter.navigate(tabLink);
    };

    Enquiry.setTableHeaderView = function(headerText) {
        return new Enquiry.views.EnquiryTableHeader({
            model: new Backbone.Model({header: headerText})
        });
    };

    Enquiry.setTableBodyView = function(options) {
        var tableBodyView = new Enquiry.views.EnquiryTableCompositeView(options);
        this.listenTo(tableBodyView, "showEnquiry", function(enquiryModel){
//            this.showEnquiry(enquiryModel);
            Enquiry.showCreateEnquiryForm(enquiryModel, true);
        });
        return tableBodyView
    };

//    Enquiry.addDataTables = function(layout) {
//        //AddDataTables - Sorting, Filter etc
//        layout.$el.find('.dataTable').dataTable({
//            "bJQueryUI": true,
//            "sPaginationType": "full_numbers",
//            "bInfo": false
//        });
//    };

    Enquiry.showDefaultDatedEnquiryRegion = function(tabLink){
        Enquiry.datedEnqLayout = new Enquiry.views.DatedEnquiriesLayout();
        Enquiry.mainLayout.tabContentRegion.show(Enquiry.datedEnqLayout);

        //TODO if all three 0

        if (_.size(Enquiry.pendingEnq) > 0) {
            Enquiry.datedEnqLayout.pendingHeader.show(Enquiry.setTableHeaderView("Pending Enquiries"));
            Enquiry.datedEnqLayout.pendingRegion.show(Enquiry.setTableBodyView({
                collection: Enquiry.pendingEnq,
                viewClass: "error"
            }));
        }

        if (_.size(Enquiry.todaysEnq) > 0) {
            Enquiry.datedEnqLayout.todaysHeader.show(Enquiry.setTableHeaderView("Today's Enquiries"));
            Enquiry.datedEnqLayout.todaysRegion.show(Enquiry.setTableBodyView({
                collection: Enquiry.todaysEnq
            }));
        }

        if (_.size(Enquiry.futureEnq) > 0) {
            Enquiry.datedEnqLayout.futureHeader.show(Enquiry.setTableHeaderView("Future Enquiries"));
            Enquiry.datedEnqLayout.futureRegion.show(Enquiry.setTableBodyView({
                collection: Enquiry.futureEnq
            }))
        }

//        Enquiry.addDataTables(Enquiry.datedEnqLayout);
        Tracker.App.addDataTables(Enquiry.datedEnqLayout);

        Enquiry.navTabCollection.selectTabView(tabLink);
        Enquiry.mainRouter.navigate(tabLink);
    };

    Enquiry.addPageHeader = function(){
        var enqHeaderLayout = new Tracker.App.views.HeaderLayout();
        Enquiry.mainLayout.pageHeaderRegion.show(enqHeaderLayout);

        //Show header
        var pgHeader = new Tracker.App.PageHeader({
            model: new Backbone.Model({header: "Enquiries"})
        });
        enqHeaderLayout.pageHeader.show(pgHeader);

        var addEnquiryBtn = new Tracker.App.views.AddButton({
            model: new Backbone.Model({
                linkUrl: "enquiry/add",
                linkClasses: "btn btn-primary",
                iconClasses: "icon-plus-sign icon-white",
                btnText: "Add Enquiry",
                id: "addEnquiry"
            })
        });

        this.listenTo(addEnquiryBtn, "App.AddButton.Click", function() {
            Enquiry.showCreateEnquiryForm();
        });
        enqHeaderLayout.addEnquiryBtn.show(addEnquiryBtn);
    };

    Enquiry.showCreateEnquiryForm = function (enquiryModel, isUpdate) {
        if (!enquiryModel) {
            enquiryModel = new Enquiry.EnquiryModel();
        }

        //Create vs Update
        if (isUpdate) {
            enquiryModel.set("taskName", "Update");
            enquiryModel.set("isNew", false);
        }
        else {
            enquiryModel.set("isNew", true);
            enquiryModel.set("taskName", "Create");
        }

        var ecView = new Enquiry.views.EnquiryCreateView({
            model: enquiryModel,
            allUsers: Tracker.Users.getAllUsersCollection()
        });

        this.listenTo(ecView, "createEnquiry", function (newEnquiryCreateView) {
            var data = Backbone.Syphon.serialize(newEnquiryCreateView);
            data.followUp = moment(data.followUp, "MM/DD/YYYY hh:mm:ss A").toDate().getTime();
            _.each(newEnquiryCreateView.multiSelectViewList, function (multiSelectView) {
                var name = multiSelectView.model.get("pillContainerId");
                data[name] = multiSelectView.selectedModelIdList;
            });
            newEnquiryCreateView.model.save(data, {
                wait: true,
                success: function (model) {
                    $.jGrowl("Enquiry for " + model.get("name") + " Saved", {theme: 'jGrowlSuccess'});
                },

                error: function (model, response) {
                    $.jGrowl("Error saving " + model.get("name") + " enquiry!", {theme: 'jGrowlError'});
                    console.error("Error Model: " + model);
                    console.error("Error Response: " + response.responseText);
                }
            });

        });

        Enquiry.navTabCollection.unSelectAll();
        Enquiry.mainLayout.tabContentRegion.show(ecView);

        if (isUpdate)
            Enquiry.mainRouter.navigate("enquiry/" + enquiryModel.id);
        else
            Enquiry.mainRouter.navigate("enquiry/add");

    };

    //Making a deep clone of users as the list
    //is modified when viewing an Enquiry
//    Enquiry.getAllUsersCollection = function() {
//        var clonedCollection = new Enquiry.MultiSelectCollection();
//        _.each(Enquiry.allUsers.models, function(user) {
//            clonedCollection.add(new Enquiry.MultiSelectModel(user.toJSON()));
//        });
//        return clonedCollection;
//    };

    Enquiry.addNavTabs = function() {
        var tabs = new Backbone.Collection([
            {label: "My Enquiries", url: Enquiry.enquiryMy_Link},
            {label: "All By Date", url: Enquiry.enquiryAllByDate_Link},
            {label: "All", url: Enquiry.enquiryAll_Link},
            {label: "Joined", url: Enquiry.enquiryJoined_Link},
            {label: "Closed", url: Enquiry.enquiryClosed_Link}
        ]);

        Enquiry.navTabCollection = new Tracker.App.HeaderTabCollection({collection: tabs});

        this.listenTo(Enquiry.navTabCollection, "collectionView:itemview:NavTab:Clicked", function(navUrl){
            if (Enquiry.enquiryMy_Link == navUrl) {
                Enquiry.controller.showMyEnquiries();
            } else if (Enquiry.enquiryAllByDate_Link == navUrl) {
                Enquiry.controller.showAllEnquiriesByDate();
            } else if (Enquiry.enquiryAll_Link == navUrl) {
                Enquiry.controller.showAllEnquiries();
            } else if (Enquiry.enquiryJoined_Link == navUrl) {
                Enquiry.controller.showAllJoinedEnquiries();
            } else if (Enquiry.enquiryClosed_Link == navUrl) {
                Enquiry.controller.showAllClosedEnquiries();
            }

//            Enquiry.mainRouter.navigate(navUrl);
        });
        Enquiry.mainLayout.navigationTabsRegion.show(Enquiry.navTabCollection);

    };

});
