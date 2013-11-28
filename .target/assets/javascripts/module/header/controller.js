Tracker.module("Header", function(Header, Tracker, Backbone, Marionette, $, _) {

    //Models
    Header.GenericModel = Backbone.Model.extend();
    Header.GenericCollection = Backbone.Collection.extend({
        model: Header.GenericModel
    })

    var tabCollection = new Header.GenericCollection([
        new Header.GenericModel({tabLabel:"Search", tabUrl: "#search"})
    ])

    Header.onTemplatesLoaded = function() {
        this.show();
    };

    Header.show = function(){
        Header.layout = new Header.views.Layout();
        Tracker.headerRegion.show(Header.layout);

        Header.setupLayout();
    };

    Header.setupLayout = function() {
        //Setup Application label
        var appLabel = new Header.AppLabel({
            model: new Backbone.Model({
                appLabel: "Tracker"
            })
        });
        Header.layout.appLabel.show(appLabel);

        //Setup nav tabs
        Header.navTabCollection = new Header.HeaderTabCollection({
            collection: tabCollection
        });
        Header.layout.navTabs.show(Header.navTabCollection)

        //Setup user dropdowns
//        Header.userDDLayout = new Header.UserDropDownLayout()
//        Header.layout.userDropDown.show(Header.userDDLayout);

//        Header.userDDLayout.userBtn.show(new Header.UserBtn({
//            model: Tracker.loggedUser
//        }))

//        Header.userDDLayout.userDropDown.show(new Header.views.UserDropDownCollection({
//            collection: userDropDownOptions,
//            model: Tracker.loggedUser
//        }))

        Header.layout.userDropDown.show(new Header.views.UserDropDownCollection({
            collection: Header.getDropDownOptions(Tracker.App.loggedUser),
            model: Tracker.App.loggedUser
        }))
    };

    Header.getDropDownOptions = function(user) {
        var role = user.attributes.roleType;
        if (role == "admin" || role == "superAdmin")
            return adminDropDownOptions;

        return userDropDownOptions;
    };

    var userDropDownOptions = new Header.GenericCollection([
        new Header.GenericModel({optionId:"profile", optionUrl: "#user/profile", optionText: "Profile", iconClass: ""}),
        new Header.GenericModel({optionId:"logout", optionUrl: "#logout", optionText: "Logout", iconClass: "icon-off"})
    ])

    var adminDropDownOptions = new Header.GenericCollection([
        new Header.GenericModel({optionId:"profile", optionUrl: "#user/profile", optionText: "Profile", iconClass: ""}),
        new Header.GenericModel({optionId:"admin", optionUrl: "#admin", optionText: "Admin", iconClass: ""}),
        new Header.GenericModel({optionId:"logout", optionUrl: "#logout", optionText: "Logout", iconClass: "icon-off"})
    ])

});