Tracker.module("Enquiry", function (Enquiry, Tracker, Backbone, Marionette, $, _) {

    Enquiry.views.FormMultiSelectLayout = Marionette.Layout.extend({
        template: "enquiry/views/layouts/formMultiSelectLayout",

        initialize: function () {
            this.selectedModelIdList = [];
        },

        regions: {
            pillContainerRegion: "#pillContainerRegion",
            inputRegion: "#inputRegion"
        },

        onRender: function () {
            var autoPillView = new Enquiry.PillContainerView({
                model: this.model
            });

            var inputView = new Enquiry.MultiSelectInputView({
                model: this.model
            });


            this.listenTo(inputView, "msInpView:add", function (multiSelectModel) {
                var view = new Enquiry.MultiSelectView({
                    model: multiSelectModel
                });

                this.listenTo(view, 'removed', function (multiSelectModel) {
                    this.selectedModelIdList = _.without(this.selectedModelIdList, multiSelectModel.id);
                    inputView.remove(multiSelectModel);
                });

                autoPillView.$el.append(view.render().el);
                this.selectedModelIdList.push(multiSelectModel.id);
            });

            this.pillContainerRegion.show(autoPillView);
            this.inputRegion.show(inputView);
            inputView.prePopulate();
        }

    });
});