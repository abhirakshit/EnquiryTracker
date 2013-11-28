(function ($) {
	window.app = window.app || { };
	
    window.app.MultiSelectModel = Backbone.Model.extend({
    });
    
    window.app.MultiSelectCollection = Backbone.Collection.extend({
        model: app.MultiSelectModel,
    
        parse: function(response) {
            return response;
        }
    });
    
} (jQuery));