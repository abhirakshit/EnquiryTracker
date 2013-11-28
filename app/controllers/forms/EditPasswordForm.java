package controllers.forms;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import controllers.Application;

import models.User;
import play.data.validation.Constraints.Required;

public class EditPasswordForm {
	
	@Required
	public String oldPassword;
	
	@Required
	public String password;
	
	@Required
	public String reEnterPassword;
	
	public String validate() {
        try {
			if (!User.authenticate(Application.getLocalUser().email, oldPassword))
			    return "Invalid password";
			
			if (!password.equals(reEnterPassword))
				return "New passwords don't match";
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			e.printStackTrace();
		}
        return null;
    }
}
