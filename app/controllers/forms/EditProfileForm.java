package controllers.forms;

import play.data.validation.Constraints.Email;
import play.data.validation.Constraints.Required;

public class EditProfileForm {
	
	public EditProfileForm() {
	}
	
	public EditProfileForm(String _firstName, String _lastName, String _email) {
		firstName = _firstName;
		lastName = _lastName;
		email = _email;
	}
	
	@Required
	public String firstName;
	public String lastName;
	@Required
	@Email
	public String email;
}
