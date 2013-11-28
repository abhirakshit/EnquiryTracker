window.app = window.app || { };

app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {

    //=====================================
    // Static variables
    //=====================================

    Mod.enquiryHome_Link = "";
    Mod.enquiryMy_Link = "enquiry/my";
    Mod.enquiryAll_Link = "enquiry/all";
    Mod.enquiryAllByDate_Link = "enquiry/allByDate";
    Mod.enquiryJoined_Link = "enquiry/joined";
    Mod.enquiryClosed_Link = "enquiry/closed";

    //Server urls (Convert to use play routes)
    Mod.user_Link = "/user/json"

    Mod.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
            "":  "showEnquiryHome",
            "user":  "showEnquiryHome",
            "user/addEnquiry": "showCreateEnquiryForm",//Remove

            "enquiry/add": "showCreateEnquiryForm",
            "enquiry/:id": "showEnquiryById",
            "enquiry/all": "showAllEnquiries",
            "enquiry/allByDate": "showAllEnquiriesByDate",
            "enquiry/my" : "showMyEnquiries",
            "enquiry/joined": "showAllJoinedEnquiries",
            "enquiry/closed": "showAllClosedEnquiries"

        }
    });

    //==================================
    //initializer called on Tracker.start(options)
    //==================================
    Mod.addInitializer(function (options) {
        console.log("Initialize Enquiry Module");
        Mod.controller = new Mod.Controller({
//            toolItems: options.toolItems,
            //we pass in the region from the app because it will be
            //converted into a Marionette.Region for us
            region: Tracker.mainRegion
        });

        Mod.mainRouter = new Mod.Router({
            controller: Mod.controller
        })

        //Get local user
        Mod.loggedUser = new Mod.UserModel([], {urlRoot: Mod.user_Link});
        Mod.loggedUser.fetch({async : false});

        //Load home page
        Mod.controller.start();
    });

    Mod.addFinalizer(function (){
        console.log("Close Enquiry module");
    });


    //==================================
    //Controller for the EnquiryTrackerModule
    //==================================
    Mod.Controller = Backbone.Marionette.Controller.extend({
        initialize: function (options) {
            //TODO: FIX THIS, DONT DELETE
//            _.bindAll(this, _.functions(this));
            this.region = options.region;
            console.log('EnquiryTrackerModule:Controller:initialize');

        },

        start: function() {
            Mod.mainLayout = new Mod.MainLayout();
            Tracker.mainRegion.show(Mod.mainLayout);

            //Populate data collections
            this.fetchAllEnquiryCollection();
            this.updateAllDatedEnquiryCollections();
            this.updateAllUsersCollection();

            //Setup home page
            this.addPageHeader();
            this.addNavTabs();
            this.showEnquiryHome();
        },

        fetchAllEnquiryCollection: function() {
            this.allEnquiries = new Mod.EnquiryCollection([], {url: "/all/enquiry"});
            this.allEnquiries.fetch({async : false});
        },

        updateMyDatedEnquiryCollections: function() {
            this.updateDatedEnquiryCollections(this.allEnquiries.getMyPendingEnquiries(),
                                               this.allEnquiries.getMyTodaysEnquiries(),
                                               this.allEnquiries.getMyFutureEnquiries());
        },

        updateAllDatedEnquiryCollections: function() {
            this.updateDatedEnquiryCollections(this.allEnquiries.getPendingEnquiries(),
                                               this.allEnquiries.getTodaysEnquiries(),
                                               this.allEnquiries.getFutureEnquiries());
        },

        updateAllUsersCollection: function() {
            this.allUsers = new Mod.MultiSelectCollection([], {
                url: "/user/all"
            });
            this.allUsers.fetch({async: false});
        },

        updateDatedEnquiryCollections: function(pending, today, future) {
            this.pendingEnq = new Mod.EnquiryCollection(pending);
            this.todaysEnq = new Mod.EnquiryCollection(today);
            this.futureEnq = new Mod.EnquiryCollection(future);
        },


        addModelToCollection: function(enquiryModel) {
            this.allEnquiries.add(enquiryModel);
        },

        getAllUsersCollection: function() {
            var clonedCollection = new Mod.MultiSelectCollection();
            _.each(this.allUsers.models, function(user) {
                clonedCollection.add(new Mod.MultiSelectModel(user.toJSON()));
            });
            return clonedCollection;
        },

        showEnquiryById: function(id) {
            if (!this.allEnquiries || _.size(this.allEnquiries) == 0)
                this.fetchAllEnquiryCollection();

            var enquiry = _.find(this.allEnquiries.models, function(enq){
                return enq.id == id
            })

            this.showCreateEnquiryForm(enquiry, true);
        },

        showEnquiry: function(enquiryModel){
            this.showCreateEnquiryForm(enquiryModel, true)
        },

        showEnquiryHome: function() {
            this.showDefaultDatedEnquiryRegion();
        },

        showCreateEnquiryForm: function(enquiryModel, isUpdate) {
            if (!enquiryModel) {
                enquiryModel = new Mod.EnquiryModel();
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

            var ecView = new Mod.EnquiryCreateView({
                model: enquiryModel,
                allUsers: this.getAllUsersCollection()
            });

            this.listenTo(ecView, "createEnquiry", function(newEnquiryCreateView){
                var data = Backbone.Syphon.serialize(newEnquiryCreateView);
                var followUpLong = moment(data.followUp, "MM/DD/YYYY hh:mm:ss A").toDate().getTime();
                data.followUp = followUpLong;
                _.each(newEnquiryCreateView.multiSelectViewList, function(multiSelectView) {
                    var name = multiSelectView.model.get("pillContainerId");
                    var ids = multiSelectView.selectedModelIdList;
                    data[name] = ids;
                });
                newEnquiryCreateView.model.save(data,{
                    wait: true,
                    success: function(model, response){
                        //TODO Show success msg
                    },

                    error: function(model, response) {
                        console.error("Error Model: " + model);
                        console.error("Error Response: " + response.responseText);
                        //TODO Show error message here
                    }
                });

            });

            //TODO Send the current enquiry tab opened
            Mod.navTabCollection.unSelectAll();
            Mod.mainLayout.tabContentRegion.show(ecView);

            if (isUpdate)
                Mod.mainRouter.navigate("enquiry/" + enquiryModel.id)
            else
                Mod.mainRouter.navigate("enquiry/add")

        },

        addPageHeader: function(){
            var enqHeaderLayout = new Mod.EnquiryHeaderLayout();
            Mod.mainLayout.pageHeaderRegion.show(enqHeaderLayout);

            var pgHeader = new Mod.PageHeaderView({
                model: new Mod.HeaderModel({header: "Enquiries"})
            })
            enqHeaderLayout.pageHeader.show(pgHeader);

            var createEnquiryBtn = new Mod.CreateEnquiryButtonView({
                model: new Mod.ButtonModel({
                    linkUrl: "user/addEnquiry",
                    linkClasses: "btn btn-primary",
                    iconClasses: "icon-plus-sign icon-white",
                    btnText: "Add Enquiry",
                    id: "addEnquiry"
                })
            })

            this.listenTo(createEnquiryBtn, "showEnquiryCreateForm", function(linkUrl) {
                this.showCreateEnquiryForm();
            });

            enqHeaderLayout.addEnquiryBtn.show(createEnquiryBtn);

        },

        addNavTabs: function() {
            var tabs = new Mod.HeaderTabCollection([
                {label: "My Enquiries", url: Mod.enquiryMy_Link},
                {label: "All By Date", url: Mod.enquiryAllByDate_Link},
                {label: "All", url: Mod.enquiryAll_Link},
                {label: "Joined", url: Mod.enquiryJoined_Link},
                {label: "Closed", url: Mod.enquiryClosed_Link}

            ]);

            Mod.navTabCollection = new Mod.NavTabCollectionView({collection: tabs});

            this.listenTo(Mod.navTabCollection, "collectionView:itemview:NavTab:Clicked", function(navUrl){
//                console.log("Navigate to: " + navUrl);
                if (Mod.enquiryMy_Link == navUrl) {
                    this.showMyEnquiries();
                } else if (Mod.enquiryAllByDate_Link == navUrl) {
                    this.showAllEnquiriesByDate();
                } else if (Mod.enquiryAll_Link == navUrl) {
                    this.showAllEnquiries();
                } else if (Mod.enquiryJoined_Link == navUrl) {
                    this.showAllJoinedEnquiries();
                } else if (Mod.enquiryClosed_Link == navUrl) {
                    this.showAllClosedEnquiries();
                }

                Mod.mainRouter.navigate(navUrl);
            });
            Mod.mainLayout.navigationTabsRegion.show(Mod.navTabCollection);

        },

        showDefaultDatedEnquiryRegion: function() {
            Mod.datedEnqLayout = new Mod.DatedEnquiriesLayout();
            Mod.mainLayout.tabContentRegion.show(Mod.datedEnqLayout);

            //TODO if all three 0

            if (_.size(this.pendingEnq) > 0) {
                Mod.datedEnqLayout.pendingHeader.show(this.setTableHeaderView("Pending Enquiries"));
                Mod.datedEnqLayout.pendingRegion.show(this.setTableBodyView({
                    collection: this.pendingEnq,
                    viewClass: "error"
                }));
            }

            if (_.size(this.todaysEnq) > 0) {
                Mod.datedEnqLayout.todaysHeader.show(this.setTableHeaderView("Today's Enquiries"));
                Mod.datedEnqLayout.todaysRegion.show(this.setTableBodyView({
                    collection: this.todaysEnq
                }));
            }

            if (_.size(this.futureEnq) > 0) {
                Mod.datedEnqLayout.futureHeader.show(this.setTableHeaderView("Future Enquiries"));
                Mod.datedEnqLayout.futureRegion.show(this.setTableBodyView({
                    collection: this.futureEnq
                }))
            }

            this.addDataTables(Mod.datedEnqLayout);

            Mod.navTabCollection.selectTabView(Mod.enquiryAllByDate_Link);
            Mod.mainRouter.navigate(Mod.enquiryAllByDate_Link);
        },

        showAllEnquiriesByDate: function() {
            this.updateAllDatedEnquiryCollections()
            this.showDefaultDatedEnquiryRegion()
        },

        showAllEnquiries: function() {
            this.displayEnquiryRegion(this.allEnquiries);
        },

        showMyEnquiries: function() {
            this.updateMyDatedEnquiryCollections()
            this.showDefaultDatedEnquiryRegion()
        },

        showAllClosedEnquiries: function() {
            this.displayEnquiryRegion(new Mod.EnquiryCollection(this.allEnquiries.getClosedEnquiries()));
        },

        showAllJoinedEnquiries: function() {
            this.displayEnquiryRegion(new Mod.EnquiryCollection(this.allEnquiries.getJoinedEnquiries()));
        },

        displayEnquiryRegion: function(enquiries) {
            Mod.allEnqLayout = new Mod.AllEnquiriesLayout();
            Mod.mainLayout.tabContentRegion.show(Mod.allEnqLayout);

            if (_.size(enquiries) > 0) {
//                Mod.allEnqLayout.enquiryTableHeader.show(this.setTableHeaderView("All Enquiries"));
                Mod.allEnqLayout.enquiryTableRegion.show(this.setTableBodyView({
                    collection: enquiries
                }));
            }
            this.addDataTables(Mod.allEnqLayout);
        },

        setTableHeaderView: function(headerText) {
            return new Mod.EnquiryTableHeaderView({
                model: new Mod.HeaderModel({header: headerText})
            });
        },

        setTableBodyView: function(options) {
            var tableBodyView = new Mod.EnquiryTableCompositeView(options);
            this.listenTo(tableBodyView, "showEnquiry", function(enquiryModel){
                this.showEnquiry(enquiryModel);
            });
            return tableBodyView
        },

        addDataTables: function(layout) {
            //AddDataTables - Sorting, Filter etc
            layout.$el.find('.dataTable').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bInfo": false
            });
        }
    });


});