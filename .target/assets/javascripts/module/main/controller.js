Tracker.module("Main", function(Main, Tracker, Backbone, Marionette, $, _) {

    this.show = function() {
//        this.updateLoggedUser();
//        this.headerView = new this.views.HeaderView();
//        this.bodyView = new this.views.BodyView();
        this.footerView = new this.views.FooterView();

//        Tracker.header.show(this.headerView);
//        Tracker.body1.show(this.bodyView);
        Tracker.footer.show(this.footerView);
    };



    this.onTemplatesLoaded = function() {
        this.show();
    };
});