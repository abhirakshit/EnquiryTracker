package controllers;

import play.mvc.Http.Context;
import play.mvc.Result;
import play.mvc.Security;

public class Secured extends Security.Authenticator {
    
    @Override
    public String getUsername(Context ctx) {
        return ctx.session().get("email");
    }
    
    @Override
    public Result onUnauthorized(Context ctx) {
        return redirect(routes.Application.login());
    }
    
    
    // Access rights
    
    public static boolean isUser() {
    	return Application.USER.equals(Application.getLocalUser().roleType);
    }
    
    public static boolean isAdmin() {
    	return Application.ADMIN.equals(Application.getLocalUser().roleType);
    }
    
    public static boolean isSuperAdmin() {
    	return Application.SUPER_ADMIN.equals(Application.getLocalUser().roleType);
    }
//    public static boolean isMemberOf(Long project) {
//        return Project.isMember(
//            project,
//            Context.current().request().username()
//        );
//    }
    
//    public static boolean isOwnerOf(Long enquiryId) {
//        return Enquiry.isOwner(
//            enquiryId,
//            Context.current().request().username()
//        );
//    }
    
}