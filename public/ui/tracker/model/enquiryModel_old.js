(function ($) {
	window.app = window.app || { };
	
	
	window.app.FormInputModel = Backbone.Model.extend({
//		defaults: {
//			name: "",
//			label: ""
//		}
	});
	
	window.app.FormInputCollection = Backbone.Collection.extend({
		model: app.FormInputModel
	});
		
	
    window.app.EnquiryModel = Backbone.Model.extend({
    	url: '/enquiry',
//    	url: '@{routes.EnquiryController.create()}',
//    	url: jsRoutes.Controllers.EnquiryController.create(),
//    	defaults: {
//    		id: null,
//    		firstName: "",
//    		lastName: "",
//    		countriesInterested: {}
//    	},
    	
    	validation: {
    		firstName: {required: true},
    		email: { pattern: 'email' },
    		contactNumber: {required: true},
    		followUp: {required: true}
    	},
    	
    	// If you return a string from the validate function,
        // Backbone will throw an error
//    	validate: function( attributes ){
//            if( attributes.firstName === "" ){
//                return "Cannot be empty";
//            }
//        },
        
//        createFormError: function(var id, var msg) {
//			
//		},
    	
    	initialize: function(){
//    		this.bind("invalid", function(model, error){
//                // We have received an error, log it, alert it or forget it :)
//                console.error( error );
//            });	
    	}
    });
    
   
 
} (jQuery));