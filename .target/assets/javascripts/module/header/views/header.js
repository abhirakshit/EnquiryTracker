Tracker.module("Header", function(Header, Tracker, Backbone, Marionette, $, _) {

    //Layouts
    Header.views.Layout = Marionette.Layout.extend({
        template: "header/layout",
        className: "navbar-inner",

        regions: {
            appLabel: "#app-label",
            navTabs: "#header-nav-tabs",
            userDropDown: "#user-dropdown"
        }
    });

//    var userDDLayoutHtml = "<div id='user-btn'></div><div id='user-dropdown'></div>"
//    Header.UserDropDownLayout = Marionette.Layout.extend({
//        className: "btn-group pull-right",
//
//        template: function(serialized_model) {
//            return _.template(userDDLayoutHtml);
//        },
//
//        regions: {
//            userBtn: "#user-btn",
//            userDropDown: "#user-dropdown"
//        }
//    })


    //Views
    var appLabel = '<%=args.appLabel%>';
    Header.AppLabel = Marionette.ItemView.extend({
        tagName: "a",
        className: "brand",
        id: "appLabel",

        template: function(serialized_model) {
            return _.template(appLabel,
                {appLabel: serialized_model.appLabel},
                {variable: 'args'});
        },

        events: {
            "click #appLabel": "showAppHome"
        },

        showAppHome: function() {
            console.log("Show App home");
        }

    });


//    <li id="search"><a href="@routes.UserController.search()">Search</a></li>
    var navTabHtml = '<a href="<%=args.tabUrl%>"><%=args.tabLabel%></a>';
    Header.HeaderTabView = Marionette.ItemView.extend({
        tagName: "li",
        template: function(serialized_model) {
            return _.template(navTabHtml,
                {tabLabel: serialized_model.tabLabel,
                    tabUrl: serialized_model.tabUrl},
                {variable: 'args'});
        }

//        onRender: function() {
//            console.log("#### Header tab rendered")
//        }
    });

    Header.HeaderTabCollection = Marionette.CompositeView.extend({
        tagName: "ul",
        className: "nav",
        itemView: Header.HeaderTabView,
//        itemViewContainer: "#main-nav"

        template: function(serialized_model) {
            return _.template("");
        }
    });

    var userDropDownOptionHtml = '<a href="<%=args.optionUrl%>"><i class="<%=args.iconClass%>"></i>&nbsp<%=args.optionText%></a>';
    Header.UserDropDownOption = Marionette.ItemView.extend({
        tagName: "li",

        initialize: function() {
            this.$el.prop("id", this.model.get("optionId"));
        },

        template: function(serialized_model) {
            return _.template(userDropDownOptionHtml,{
                optionUrl: serialized_model.optionUrl,
                optionText: serialized_model.optionText,
                iconClass: serialized_model.iconClass
            }, {variable: "args"})
        },

        events: {
            "click": "clicked"
        },

        clicked: function(event){
            event.preventDefault();
            this.trigger("dropdown:selected", "");
        }
    });


    Header.views.UserDropDownCollection = Marionette.CompositeView.extend({
        template: "header/userBtn",
        className: "btn-group pull-right",
        itemView: Header.UserDropDownOption,
        itemViewContainer: "#user-actions",

        serializeData: function(){
            this.data = this.model.toJSON();
//            this.data.linkUrl = "enquiry/" + this.data.id;
            return this.data;
        },

        initialize: function() {
            var that = this;
            this.on("itemview:dropdown:selected", function(childView, msg){
                console.dir(childView);
                that.trigger("collectionview:itemview:dropdown:selected", childView.model);
            });
        },

        onRender: function() {
            this.$el.find("#logout").before('<li class="divider"></li>')
        }

//        events: {
////            "click #profile": "showProfile",
////            "click #admin": "showAdmin",
////            "click #logout": "logout"
//        },
//
//        showProfile: function(event) {
//            event.preventDefault()
//            console.log("Show profile")
//        },
//
//        showAdmin: function() {
//            event.preventDefault()
//            console.log("Show Admin")
//        },
//
//        logout: function() {
//            event.preventDefault()
//            console.log("Logout")
//        }
    })
});