	window.app = window.app || { };
	
	//Application
	window.app.Tracker = new Backbone.Marionette.Application();

    app.Tracker.addRegions({
  	  mainRegion: "#main-region"
  	});

    app.Tracker.vent.on('all', function (evt, model) {
        console.log('Tracker DEBUG: Event Caught: ' + evt);
        if (model) {
            console.dir(model);
        }
    });

	app.Tracker.addInitializer(function(){
		// Initiate the router
//		var MainRouter = new app.Router;
//		Backbone.history.start();
        console.log("Start Initializer...");
        if (Backbone.history){
            console.log("Start Backbone history...");
            Backbone.history.start(
//                {pushState: true}
            );
        }
	});

//    app.Tracker.on("initialize:after", function(){
////        if (Backbone.history){
////            console.log("Start Backbone history...");
////            Backbone.history.start();
////        }
//    });
