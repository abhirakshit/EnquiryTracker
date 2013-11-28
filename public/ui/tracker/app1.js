require.config({

    baseUrl: 'javascripts/vendor',
    paths: {
        jquery: "jquery/jquery",
        underscore: "underscore/underscore",
        backbone: "backbone/backbone",
        marionette: "marionette/lib/backbone.marionette",
        moduleHelper: "moduleHelper"
    },

    shim: {
        underscore: {
            exports: "_"
        },

        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },

        marionette: {
            deps: ["backbone"],
            exports: "Marionette"
        },

        moduleHelper: {
            deps: ["marionette"]
        }
    }
});

require(["marionette", "moduleHelper"], function (Marionette) {
    window.Tracker = new Marionette.Application();
    Tracker.addRegions({
//        header: "#header-region",
        footer: "#footer-region",
//        body1: "#body1-region",
//        body2: "#body2-region"
    });

    require(["module/main/loader"], function () {
        Tracker.start();
    });
});