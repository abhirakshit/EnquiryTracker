Tracker.module("Users",function (Users, Tracker, Backbone, Marionette, $, _) {

    var allUsersLayoutHtml = '<div id="users-table-header"></div><div id="users-table-region" class="tableDiv"></div>';
    Users.AllUsersLayout = Marionette.Layout.extend({

        template: function(serialized_model) {
            return _.template(allUsersLayoutHtml);
        },

        regions: {
            usersTableHeader: "#users-table-header",
            usersTableRegion: "#users-table-region"
        }
    });

    var tableHeaderHtml = "<legend><%=args.header%></legend>";
    Users.TableHeader = Marionette.ItemView.extend({
        template: function(serialized_model) {
            return _.template(tableHeaderHtml, {header: serialized_model.header},{variable: "args"});
        }
    });


    Users.views.RowView = Marionette.ItemView.extend({
        template: "users/views/row",
//        templateHelpers: Users.dateViewHelper,
        tagName: "tr",
        className: "rowlink",
        serializeData: function(){
            this.data = this.model.toJSON();
            this.data.linkUrl = "user/" + this.data.id;
            return this.data;
        },

        events: {
            "click td": "rowClicked"
        },

        rowClicked: function(event){
            event.preventDefault();
            this.trigger("showUser", this.model);
        }
    });

    Users.views.UsersTableCompositeView = Marionette.CompositeView.extend({
        tagName: "table",
        template: "users/views/tableContainer",
        itemView: Users.views.RowView,
        className: "display dataTable table table-striped table-bordered",

        appendHtml: function(compositeView, itemView, index){
            if (this.options.viewClass) {
                itemView.$el.addClass(this.options.viewClass);
            }
            this.listenTo(itemView, "showUser", function(model){
                this.trigger("showUser", model);
            })
            compositeView.$("tbody").append(itemView.el);
        }
    });


    Users.views.AddUserForm = Marionette.ItemView.extend({
        template: "users/views/addUserForm"
    });

});