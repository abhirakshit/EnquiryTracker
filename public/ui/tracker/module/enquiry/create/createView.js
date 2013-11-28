window.app = window.app || { };

app.Tracker.module("Enquiry.Create",function (EnquiryMod, TrackerApp, Backbone, Marionette, $, _) {

    EnquiryMod.EnquiryCreateView = Backbone.Marionette.ItemView.extend({
        template: "#enquiry-create-form",
//        template: JST["#enquiry-create-form"],
        templateHelpers: EnquiryMod.dateViewHelper,
        multiSelectViewList: [],
        events: {
            "click #createNewEnquiry": "createEnquiry"
        },

        initialize: function () {
            this.listenTo(this.model, "change", function(view){
                console.log("Model has changed");

                //Reshuffle enquiries to respective collections
                EnquiryMod.controller.addModelToCollection(this.model);


                //Reload previous page content
                EnquiryMod.controller.showDefaultDatedEnquiryRegion();
            });
        },

        createEnquiry: function (event) {
            event.preventDefault();
            this.trigger("createEnquiry", this);
        },

        onRender: function() {
            Backbone.Validation.bind(this);

            //Pre-populate existing enquiry
            var data = this.model.attributes;
            Backbone.Syphon.deserialize(this, data);

            this.setFollowUp(data.followUp);
            this.setStatusView(data.status);
            // This has to be before addAssigneeView as addAssigneeView changes the list
            if (!data.isNew)
                this.setHistoryView(data.comments, this.options.allUsers);

            var addServicesView = this.setMultiSelectView({
                pillContainerId: "servicesInterested",
                selectionContainerId: "add-service",
                containerId: "AddServiceView",
                url: "/service/all",
                selectionTag: "name",
                placeholder: "Add Service...",
                controlId: "#serviceControls"
            }, data.serviceNames);
            this.multiSelectViewList.push(addServicesView);

            var addCountriesView = this.setMultiSelectView({
                pillContainerId: "countriesInterested",
                selectionContainerId: "add-country",
                containerId: "AddCountryView",
                url: "/country/all",
                selectionTag:"name",
                placeholder:"Add Country...",
                controlId: "#serviceControls"
            }, data.countryNames);
            this.multiSelectViewList.push(addCountriesView);

            var addAssigneeView = this.setMultiSelectView({
                pillContainerId: "assignedTo",
                selectionContainerId: "assign-to",
                containerId: "AddAssigneeView",
                url: "/user/all",
                selectionTag:"fullName",
                placeholder:"Assign To...",
                controlId: "#assigneeControls"
            }, data.assigneeNames, this.options.allUsers);
            this.multiSelectViewList.push(addAssigneeView);
        },

        setHistoryView: function(comments, allUsersCollection) {
            _.each(comments, function(comment){
                var user = _.find(allUsersCollection.models, function(user){
//                    console.log(comment.creatorId + "\t" + user.get("id"));
                    return comment.creatorId == user.get("id");
                })

                comment.creatorName = user.get("name");
            });
            var commentCollection = new EnquiryMod.CommentCollection(comments);

            // Sort comments inverse to creation date
            commentCollection.comparator = function(comment) {
                return - moment(comment.get("createdOn"));
            }
            commentCollection.sort();

            var hcView = new EnquiryMod.CommentHistoryView({
                collection: commentCollection
            });
            var history = this.$el.find("#history");
            history.append(hcView.render().el);
        },

        setMultiSelectView: function(options, selectedNames, allOptions) {
            if (selectedNames) {
                selectedNames = selectedNames.split(",");
            }

            var msView = new EnquiryMod.FormMultiSelectLayout({
                model: new EnquiryMod.MultiSelectModel({
                    pillContainerId: options.pillContainerId,
                    selectionContainerId: options.selectionContainerId,
                    containerId: options.containerId,
                    url: options.url,
                    selectionTag: options.selectionTag,
                    placeholder: options.placeholder,
                    selectedNames: selectedNames,
                    allOptions: allOptions
                })
            })
            var msControls = this.$el.find(options.controlId);
            msControls.append(msView.render().el);
            return msView;
        },

        setStatusView: function(status) {
            var addStatusView = new EnquiryMod.FormDropDownView({
                model: new EnquiryMod.MultiSelectModel({
                    name: "status",
                    label: "Status",
                    url: "/enquiry/status/all",
                    selected: status
                })
            })
            var statusDropDown = this.$el.find("#statusDropDown");
            statusDropDown.append(addStatusView.render().el);
        },

        setFollowUp: function(followUpDateTime) {
            if (!followUpDateTime)
                followUpDateTime = moment.utc().toDate();
            else {
                followUpDateTime = moment(followUpDateTime).utc().toDate();
            }
            var dtPicker = this.$el.find("#datetimepicker").datetimepicker({
                language: 'en',
                pick12HourFormat: true
            });
            var picker = dtPicker.data('datetimepicker');
            picker.setLocalDate(followUpDateTime);
        }

    });

    //TODO Should be move to the enquiry show view
    EnquiryMod.CommentView = Backbone.Marionette.ItemView.extend({
        template: "#commentItemViewTemplate",
        className: "comment-container",

        initialize: function(){
            var createdOn = moment(this.model.get('createdOn')).format("ddd, MMM Do, hh:mm a");
            var creatorName = this.model.get('creatorName');
            var creationInfo = "<b>" + createdOn + "</b> [<i>" + creatorName + "</i>]: ";
            this.model.set('creationInfo', creationInfo);
        }
    });

    EnquiryMod.CommentHistoryView = Backbone.Marionette.CompositeView.extend({
        template: "#historyViewTemplate",
        itemView: Mod.CommentView,
        itemViewContainer: "#comments",
        className: "control-group"
    });
});