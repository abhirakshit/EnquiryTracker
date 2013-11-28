package controllers.forms;

import play.data.validation.Constraints.Email;
import play.data.validation.Constraints.Required;

public class UserForm {

	@Required
	public String firstName;
	public String lastName;
	@Required
	@Email
	public String email;
	
	@Required
	public String password;
	
	@Required
	public String reEnterPassword;
	
	//TODO 
//	public String validate() {
//        
//    }
	
}
