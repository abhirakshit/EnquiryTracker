package controllers;

import java.util.ArrayList;
import java.util.List;

import ch.qos.logback.core.status.StatusUtil;

import models.Countries;
import models.Enquiry;
import models.EnquiryCountries;
import models.EnquiryServices;
import models.Services;
import models.User;
import models.UserToEnquiry;
import play.data.Form;
import play.data.validation.ValidationError;
import play.i18n.Messages;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import play.mvc.Http.Context;
import utils.EnumUtils;
import controllers.forms.UserForm;

@Security.Authenticated(Secured.class)
public class Admin extends Controller {

	static Form<UserForm> userForm = Form.form(UserForm.class);
	public static Result index() {
		if (!Secured.isAdmin() && !Secured.isSuperAdmin()) {
			flash(Application.FLASH_ERROR_KEY, "Unauthorized user!!!");
			return Application.index(); 
		}

		return ok(views.html.admin.index.render(User.findAll(), Application.getLocalUser()));
	}
	
	public static Result addUser(String roleType) {
		if (!Secured.isAdmin() && !Secured.isSuperAdmin()) {
			flash(Application.FLASH_ERROR_KEY, "Unauthorized user!!!");
			return Application.index();
		}

		return ok(views.html.admin.addUser.render(userForm, roleType));
	}

	public static Result createUser(String roleType) {
		// Only can create admins. User cannot create anything
		if (Secured.isUser() || 
				((Application.ADMIN.equals(roleType) || Application.SUPER_ADMIN.equals(roleType)) && !Secured.isSuperAdmin())
				) {
			flash(Application.FLASH_ERROR_KEY, "Unauthorized user!!!");
			return Application.index();
		}
			
		Form<UserForm> completedForm = userForm.bindFromRequest();
		if (completedForm.hasErrors()) {
			flash(Application.FLASH_ERROR_KEY, "Error in form!!!");
			return badRequest(views.html.admin.addUser.render(completedForm, roleType));
		} else {
			UserForm studForm = completedForm.get();
			if (!studForm.password.equals(studForm.reEnterPassword)) {
				flash(Application.FLASH_ERROR_KEY, "Error in form!!!");
				completedForm.errors().put("password", getErrList("password", Messages.get("enquiry.password.signup.error.passwords_not_same")));
				completedForm.errors().put("reEnterPassword", getErrList("reEnterPassword", Messages.get("enquiry.password.signup.error.passwords_not_same")));
				return badRequest(views.html.admin.addUser.render(completedForm, roleType));
			}
			User.create(studForm, roleType);
			flash(Application.FLASH_MESSAGE_KEY, roleType + " created successfully!!");
			return addUser(roleType);
		}
	}
	
	public static List<ValidationError> getErrList(String errField, String message) {
		List<ValidationError> errList = new ArrayList<ValidationError>();
		errList.add(new ValidationError(errField, message));
		return errList;
	}
	
	/**
	 * Migrations: BE VERY CAREFUL
	 */
	public static Result addCountries() {
		
		// Add all Countries
		for (String country: EnumUtils.countryList) {
			Countries.create(country);
		}
		return index();
	}
	
	public static Result addServices() {
		// Add all Services
		for (String service : EnumUtils.courseList) {
			Services.create(service);
		}
		return index();
	}

	public static Result updateEnquiryServices() {
		// Iterate over all enquiries and populate EnquiryCountries and
		// EnquiryServices
		for (Enquiry enq : Enquiry.findAll()) {
			String serviceName = enq.courseType;
			Services service = Services.findByName(serviceName);
			enq.addService(service);
			enq.update();
		}

		return index();
	}

	public static Result updateEnquiryCountries() {
		// Iterate over all enquiries and populate EnquiryCountries and
		// EnquiryServices
		for (Enquiry enq : Enquiry.findAll()) {
			String countryName = enq.countryInterested;
			Countries country = Countries.findByName(countryName);
			enq.addCountry(country);
			country.update();
		}

		return index();
	}
}
