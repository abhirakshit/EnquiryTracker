Tracker.module("Users", function(Users, Tracker, Backbone, Marionette, $, _) {

    //Making a deep clone of users as the list
    //is modified when viewing an Enquiry
    Users.getAllUsersCollection = function() {
        var clonedCollection = new Tracker.App.MultiSelectCollection();
        _.each(Users.allUsers.models, function(user) {
            clonedCollection.add(new Tracker.App.MultiSelectModel(user.toJSON()));
        });
        return clonedCollection;
    };

    Users.onTemplatesLoaded = function() {
        this.show();
    };

    Users.show = function() {
//        Users.updateLoggedUser();
        console.log("Show Users...")
        Users.controller = new Users.Controller({
            region: Tracker.pageContent
        });

        Users.router = new Users.Router({
            controller: Users.controller
        })
    };

    Users.users = "#users";
    Users.admin = "#users/admin";

    Users.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "users": "showUsersHome"
        }
    });

    Users.Controller = Marionette.Controller.extend({
        initialize: function (options) {
            this.region = options.region;
            console.log('UserModule Initialize');
            //TODO Populate Users Collection
            this.updateAllUsersCollection();
        },

        showUsersHome: function() {
            Users.mainLayout = new Tracker.App.views.MainLayout();
            this.region.show(Users.mainLayout);

            //Add views
            Users.addPageHeader();
            Users.addNavTabs();
            Users.showAllUsers();
            Users.router.navigate(Users.users);
        },

        updateAllUsersCollection: function() {
            Users.allUsers = new Tracker.App.MultiSelectCollection([], {url: Tracker.App.allUsers_Url});
            Users.allUsers.fetch({async: false});
        }
    });

    Users.addPageHeader = function() {
        var headerLayout = new Tracker.App.views.HeaderLayout();
        Users.mainLayout.pageHeaderRegion.show(headerLayout);

        //Show header
        var pgHeader = new Tracker.App.PageHeader({
            model: new Backbone.Model({header: "Users"})
        });
        headerLayout.pageHeader.show(pgHeader);

        //Show Create Enquiry Btn
        var addUserBtn = new Tracker.App.views.AddButton({
            model: new Backbone.Model({
                linkUrl: "user/add",
                linkClasses: "btn btn-primary",
                iconClasses: "icon-plus-sign icon-white",
                btnText: "Add User",
                id: "addUser"
            })
        });

        this.listenTo(addUserBtn, "App.AddButton.Click", function() {
            Users.showAddUserForm();
        });
        headerLayout.addEnquiryBtn.show(addUserBtn);
    };

    Users.showAddUserForm = function() {
        // Create Add User Form View
        // Add it to the page content
        var addUserForm = new Users.views.AddUserForm({
            model: new Users.Model()
        });
        Users.mainLayout.tabContentRegion.show(addUserForm);

        // Listen to its create btn
        this.listenTo(addUserForm, Users.trigger.addUserEvt, function (addUserView) {
            var data = Backbone.Syphon.serialize(addUserView);
            console.log(data);

            addUserView.model.save(data, {
                wait: true,
                success: function (model) {
                    $.jGrowl("User " + model.get("name") + " Saved", {theme: 'jGrowlSuccess'});
                },

                error: function (model, response) {
                    $.jGrowl("Error saving " + model.get("name") + " !", {theme: 'jGrowlError'});
                    console.error("Error Model: " + model);
                    console.error("Error Response: " + response.responseText);
                }
            });
        });
        // Remove all tab selections

        // Navigate to correct URL
    };

    Users.addNavTabs = function() {
        var tabs = new Backbone.Collection([
            {label: "All", url: Users.users},
            {label: "Admin", url: Users.admin}
        ]);

        Users.navTabCollection = new Tracker.App.HeaderTabCollection({collection: tabs});

        this.listenTo(Users.navTabCollection, "collectionView:itemview:NavTab:Clicked", function(navUrl){
//                console.log("Navigate to: " + navUrl);
            if (Users.users == navUrl) {
                Users.showAllUsers();
            } else if (Users.admin == navUrl) {
//                Users.showAllEnquiriesByDate();
            }

//            Enquiry.mainRouter.navigate(navUrl);
        });
        Users.mainLayout.navigationTabsRegion.show(Users.navTabCollection);
    }

    Users.showAllUsers = function () {
        var allUsersLayout = new Users.AllUsersLayout();
        Users.mainLayout.tabContentRegion.show(allUsersLayout);

        var tableBodyView = new Users.views.UsersTableCompositeView({
            collection: Users.allUsers
        });
        allUsersLayout.usersTableRegion.show(tableBodyView);

        Tracker.App.addDataTables(allUsersLayout);

        Users.navTabCollection.selectTabView(Users.users);
    }

});