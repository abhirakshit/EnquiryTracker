package controllers;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.JsonNode;

import models.Countries;
import models.Enquiry;
import models.Services;
import models.User;
import play.data.Form;
import play.i18n.Messages;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import utils.EnumUtils;
import controllers.forms.EditPasswordForm;
import controllers.forms.EditProfileForm;
import controllers.forms.EnquiryForm;
import controllers.forms.SearchForm;
import controllers.forms.UserForm;
import flexjson.JSONSerializer;

@Security.Authenticated(Secured.class)
public class UserController extends Controller{
	
	static Form<EnquiryForm> enquiryForm = Form.form(EnquiryForm.class);
	static Form<SearchForm> searchForm = Form.form(SearchForm.class);
	static Form<EditProfileForm> editProfileForm = Form.form(EditProfileForm.class);
	static Form<EditPasswordForm> editPasswordForm = Form.form(EditPasswordForm.class);
	public static String genericFormErr = Messages.get("enquiry.form.generic.error");
	
	public static Result getLoggedUser() {
		JSONSerializer serializer = new JSONSerializer();
		return ok(serializer.exclude("password").serialize(Application.getLocalUser()));	
	}
	
	public static Result all() {
		List<User> userList = User.findAll();
		JSONSerializer postDetailsSerializer = new JSONSerializer();
		return ok(postDetailsSerializer.serialize(userList));
	}

	public static Result getEnquiries() {
		JSONSerializer serializer = new JSONSerializer();
		return ok(serializer.exclude("comments.class").serialize(Application.getLocalUser().getEnquiries()));
	}
	
	public static Result index() {
//		Long userId = Application.getLocalUser().id;
//		User user = User.findById(userId);
		return ok(views.html.user.index_new.render(    
//				user.getPendingEnquiries(),
//				user.getTodaysEnquiries(),
//				user.getFutueEnquiries()
				));
		
//		return ok(views.html.user.index.render(    
//				user.getPendingEnquiries(),
//				user.getTodaysEnquiries(),
//				user.getFutueEnquiries()
//				));
	}
	
	public static Result create() {
		JsonNode reqJson = request().body().asJson();
		System.err.println(reqJson);
		User user = User.create(reqJson);
		return ok(new JSONSerializer().serialize(user));
	}
	
	public static Result profile() {
		return ok(views.html.user.profile.render(Application.getLocalUser()));
	}
	
	public static Result editProfile() {
		return ok(views.html.user.editProfile.render(getProfileForm()));
	}
	
	private static Form<EditProfileForm> getProfileForm(){
		User user = Application.getLocalUser();
		return editProfileForm.fill(new EditProfileForm(user.firstName, user.lastName, user.email));
	}

	public static Result updateProfile() {
		Form<EditProfileForm> updateForm = editProfileForm.bindFromRequest();
		if (updateForm.hasErrors()) {
			flash(Application.FLASH_ERROR_KEY, genericFormErr);
			return badRequest(views.html.user.editProfile.render(updateForm));
		} else {
			User.updateUserProfile(updateForm.get());
			flash(Application.FLASH_MESSAGE_KEY, "Profile updated!");
		}
		return redirect(routes.UserController.profile());
	}

	public static Result editPassword() {
		return ok(views.html.user.editPassword.render(editPasswordForm));
	}

	public static Result updatePassword() {
		Form<EditPasswordForm> updatedForm = editPasswordForm.bindFromRequest();
		if (updatedForm.hasErrors()) {
			String errMsg = genericFormErr;
			if (updatedForm.error("") != null)
				errMsg = updatedForm.error("").message();

			flash(Application.FLASH_ERROR_KEY, errMsg);
			return badRequest(views.html.user.editPassword.render(updatedForm));
		} else {
			EditPasswordForm changePasswordForm = updatedForm.get();
			User.changePassword(changePasswordForm.password);
			flash(Application.FLASH_MESSAGE_KEY, Messages.get("enquiry.reset_password.message.success.auto_login"));
		}
		return redirect(routes.UserController.profile());
	}

	public static Result allEnquiries() {
		return ok(views.html.user.allEnquiries.render(Enquiry.getAllPendingUserEnquiries(),
				Enquiry.getTodaysUserEnquiries(),
				Enquiry.getAllFutueUserEnquiries()));
	}
	
	public static Result allEnquiriesNoFilter() {
		return ok(views.html.user.allEnquiriesNoFilter.render(Enquiry.findAllNonClosed()));
	}
	
	public static Result closedEnquiries() {
		return ok(views.html.user.closedEnquiries.render(Enquiry.findAllClosed()));
	}
	
	public static Result addEnquiry() {
//		return ok(views.html.user.addEnquiry.render(enquiryForm, 
//				EnumUtils.statusList, 
//				Countries.findAll(),
//				Services.findAll(), 
//				User.findAll()));
		return ok(views.html.enquiry.addEnquiry.render(enquiryForm, 
				EnumUtils.statusList, 
				Countries.findAll(),
				Services.findAll(), 
				User.findAll()));
	}
	
	public static Result createEnquiry() {
		Form<EnquiryForm> completedEnquiryForm = enquiryForm.bindFromRequest();
		if (completedEnquiryForm.hasErrors()) {
			flash(Application.FLASH_ERROR_KEY, genericFormErr);
			return badRequest(views.html.user.addEnquiry.render(completedEnquiryForm, 
					EnumUtils.statusList, 
					Countries.findAll(),
					Services.findAll(), 
					User.findAll()));
		} else {
			EnquiryForm newEnquiry = completedEnquiryForm.get();
//			Long enqId = Enquiry.create(newEnquiry);
			
//			addAssignees(newEnquiry, enqId);
			
			// Add a new enquiry comment
//			addComments(newEnquiry, enqId);
			
			flash(Application.FLASH_MESSAGE_KEY, "New enquiry for " + newEnquiry.firstName + " created successfully!");
			return redirect(routes.Application.index());
		}
	}
	
//	private static void addAssignees(EnquiryForm enqFormData, Long enqId) {
//		// Add to the UserToEnquiry table
//		UserToEnquiry.create(enqFormData.assignedTo, enqId);
//		if (enqFormData.assignedTo1 != null)
//			UserToEnquiry.create(enqFormData.assignedTo1, enqId);
//		
//		if (enqFormData.assignedTo2 != null)
//			UserToEnquiry.create(enqFormData.assignedTo2, enqId);
//			
//	}
	
//	private static String updateAssignees(EnquiryForm newEnquiry, Long enqId) {
//		
//		StringBuilder changes = new StringBuilder();
//		List<UserToEnquiry> origAssigned = UserToEnquiry.findByEnqId(enqId);
//		List<UserToEnquiry> origAssignedCopy = new ArrayList<UserToEnquiry>(origAssigned);
//		List<Long> newAssignedIdList = new ArrayList<Long>();
//		newAssignedIdList.add(newEnquiry.assignedTo);
//		if (newEnquiry.assignedTo1 != null)
//			newAssignedIdList.add(newEnquiry.assignedTo1);
//		if (newEnquiry.assignedTo2 != null)
//			newAssignedIdList.add(newEnquiry.assignedTo2);
//		for (UserToEnquiry obj:origAssignedCopy) {
//			//existing assignee
//			if (newAssignedIdList.contains(obj.userId)) {
//				newAssignedIdList.remove(obj.userId);
//				origAssigned.remove(obj);
//			}
//				
//		}
//		
//		//Remove old
//		for (UserToEnquiry obj: origAssigned) {
//			UserToEnquiry.delete(obj.userId, obj.enquiryId);
//			changes.append("<br><i>Assignee Removed</i>: " + User.getFullName(obj.userId));
//		}
//		
//		//Create new
//		for (Long id: newAssignedIdList) {
//			UserToEnquiry.create(id, enqId);
//			changes.append("<br><i>Assignee Added</i>: " + User.getFullName(id));
//		}
//		
//		return changes.toString();
//			
//	}
	
//	private static void addComments(EnquiryForm newEnquiry, Long enqId) {
//		Comment.create(enqId, newEnquiry.creatorId, "Enquiry Created!");
//		
//		// Create comment if the user has added one.
//		if (newEnquiry.comments != null && !newEnquiry.comments.isEmpty())
//			Comment.create(enqId, newEnquiry.creatorId, newEnquiry.comments);
//	}
	
	public static Result showEnquiry(String enquiryId) {
		long enqIdLong = Long.parseLong(enquiryId);
		Enquiry enquiry = Enquiry.findById(enqIdLong);
		return ok(views.html.user.showEnquiry.render(enquiryForm, 
				EnumUtils.statusList,
				Countries.findAll(),
				Services.findAll(),
				enquiry, 
				enquiry.getCommentHistory(enqIdLong),
				User.findAll(),
				enquiry.getAssigneeList(),
				new ArrayList<Countries>(enquiry.getCountries()),
				new ArrayList<Services>(enquiry.getServices())
				));
	}
	
	public static Result updateEnquiry(String enquiryId) {
		Form<EnquiryForm> updatedForm = enquiryForm.bindFromRequest();
		if (updatedForm.hasErrors()) {
			flash(Application.FLASH_ERROR_KEY, genericFormErr);
			return showEnquiry(enquiryId);
		} else {
//			User loggedUser = Application.getLocalUser();
			Enquiry enquiry = Enquiry.findById(Long.parseLong(enquiryId));
			EnquiryForm updatedEnquiry = updatedForm.get();
			//Update enquiry
//			Enquiry.update(enquiry, updatedEnquiry);
			
			// Update Assignees
//			changeList += updateAssignees(updatedEnquiry, enquiry.id);
			
			// Create comment if the user has added one.
//			if (!changeList.isEmpty())
//				Comment.create(enquiry.id, loggedUser.id, changeList);
			
			flash(Application.FLASH_MESSAGE_KEY, "Enquiry for " + updatedEnquiry.firstName + " updated successfully!");
			
//			// Take super user to all enquiries page
//			if (!loggedUser.id.equals(enquiry.assignedTo))
			return redirect(routes.UserController.allEnquiries());
						
//			return redirect(routes.Application.index());
				
		}
	}
	
	public static Result deleteEnquiry(String enquiryId) {
		Enquiry enquiry = Enquiry.findById(Long.parseLong(enquiryId));
		enquiry.delete();
		flash(Application.FLASH_MESSAGE_KEY, "Enquiry deleted successfully!");
		return redirect(routes.Application.index());
	}

	 
    public static Result search() {
    	return ok(views.html.user.search.render(searchForm, EnumUtils.searchTypeList, new ArrayList<Enquiry>()));
    }
    
    public static Result doSearch() {
    	Form<SearchForm> completedForm = searchForm.bindFromRequest();
    	if(completedForm.hasErrors()) {
    		flash(Application.FLASH_ERROR_KEY, "Error in form!");
    		return badRequest(views.html.user.search.render(completedForm, EnumUtils.searchTypeList, new ArrayList<Enquiry>()));
    	} else {
    		SearchForm form = completedForm.get();
    		return ok(views.html.user.search.render(searchForm, EnumUtils.searchTypeList, Enquiry.search(form.searchVal, form.searchBy)));
    	}
    }
    
    public static Result getAllUserRoles() {
		JSONSerializer postDetailsSerializer = new JSONSerializer();
		List<RoleTypeObj> roleTypesList = new ArrayList<RoleTypeObj>();
		roleTypesList.add(new RoleTypeObj(Application.USER, Application.USER_LABEL));
		if (Secured.isAdmin()) {
			roleTypesList.add(new RoleTypeObj(Application.ADMIN, Application.ADMIN_LABEL));
		} else if (Secured.isSuperAdmin()) {
			roleTypesList.add(new RoleTypeObj(Application.ADMIN, Application.ADMIN_LABEL));
			roleTypesList.add(new RoleTypeObj(Application.SUPER_ADMIN, Application.SUPER_ADMIN_LABEL));
		}
		
		return ok(postDetailsSerializer.exclude("class").serialize(roleTypesList));
	}
    
    
    public static class RoleTypeObj{
		public String text;
		public String label;
		public RoleTypeObj(String text, String label) {
			this.text = text;
			this.label = label;
		}
	}
    
    
}
