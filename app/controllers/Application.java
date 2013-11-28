package controllers;

import models.User;
import play.Routes;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Http.Session;
import play.mvc.Result;
import controllers.forms.LoginForm;
import play.api.mvc.Action;
import play.api.mvc.AnyContent;
import play.mvc.*;
import play.*;

public class Application extends Controller {
  
	public static final String FLASH_MESSAGE_KEY = "message";
	public static final String FLASH_ERROR_KEY = "error";
	
	
	public static final String USER_LABEL = "User";
	public static final String ADMIN_LABEL = "Admin";
	public static final String SUPER_ADMIN_LABEL = "Super Admin";
	public static final String USER = "user";
	public static final String ADMIN = "admin";
	public static final String SUPER_ADMIN = "superAdmin";
	
	static final Form<LoginForm> loginForm = Form.form(LoginForm.class);
    public static Result index() {
    	if (isUserLoggedIn()) {
//    		return redirect(routes.UserController.index());
//    		return ok(views.html.user.index_new.render());
    		return ok(views.html.main_new.render());
    	}
        return ok(views.html.index.render(loginForm));
    }
    
    public static User getLocalUser() {
    	String email = session().get("email");
    	if (email == null || email.isEmpty())
    		return null;
		final User localUser = User.findByEmail(email);
		return localUser;
	}
    
    public static boolean isUserLoggedIn() {
    	return getLocalUser() != null; 
    }
    
    public static Result login() {
    	return index();
    }
    
    public static Result doLogin() {
    	Form<LoginForm> completedForm = loginForm.bindFromRequest();
    	if (completedForm.hasErrors()) {
    		flash(Application.FLASH_ERROR_KEY, completedForm.errors().get("").get(0).message());
    		return badRequest(views.html.index.render(loginForm));
    	} else {
    		session("email", completedForm.get().email);
    		return index();
    	}
    }
    
    public static Result logout() {
    	session().clear();
    	flash(Application.FLASH_MESSAGE_KEY, "You have been logged out.");
    	return index();
    }
   
    
    public static Result javascriptRoutes() {
        response().setContentType("text/javascript");
        return ok(
            Routes.javascriptRouter("jsRoutes",
                controllers.routes.javascript.EnquiryController.create(),
                controllers.routes.javascript.CountryController.all()
            )
        );
    }

    /**
         * Redirects to the appropriate JavaScript asset depending on the environment.
         * If running in <em>dev mode</em>, raw scripts are used.
         * If running in <em>prod mode</em>, uglyfied and inlined scripts are used.
         *
         * @see controllers.Assets.at
         */
        public static Action<AnyContent> javascripts(String file) {
            String folder = "javascripts/";
            if (Play.isProd()) {
                folder = "javascripts-min/";
            }

            Logger.debug(String.format("[%s mode] JavaScript file '%s' served from '%s'.",
                Play.isProd() ? "prod" : "dev", file, folder + file));

            return controllers.Assets.at("/public", folder + file).apply();
        }
  
}
