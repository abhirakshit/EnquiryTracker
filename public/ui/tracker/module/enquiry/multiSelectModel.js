window.app = window.app || { };
app.Tracker.module("EnquiryModule",function (Mod, Tracker, Backbone, Marionette, $, _) {
	
    Mod.MultiSelectModel = Backbone.Model.extend({
    });
    
    Mod.MultiSelectCollection = Backbone.Collection.extend({
        model: Mod.MultiSelectModel,
    
        parse: function(response) {
            return response;
        }
    });
    
});