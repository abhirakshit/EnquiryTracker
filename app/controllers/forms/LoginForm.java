package controllers.forms;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import models.User;
import play.data.validation.Constraints.Required;

public class LoginForm {

	@Required
	public String password;
	@Required
	public String email;
	
	public String validate() {
        try {
			if (!User.authenticate(email, password)) {
			    return "Invalid user or password";
			}
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			e.printStackTrace();
		}
        return null;
    }
	
}
