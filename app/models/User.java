package models;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import play.data.format.Formats;
import play.db.ebean.Model;
import utils.DateUtils;
import utils.EnumUtils.Status;
import utils.StringUtils;

import com.avaje.ebean.validation.Email;

import controllers.Application;
import controllers.forms.EditProfileForm;
import controllers.forms.UserForm;

@Entity
@Table(name = "users")
public class User extends Model {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;

	@Email
	@Column(unique = true)
	public String email;

	public String firstName;
	
	public String lastName;
	
	public String password;
	
	public String roleType;

	@Formats.DateTime(pattern = "yyyy-MM-dd HH:mm:ss")
	public Date lastLogin;

	public boolean active = true;

	public static final Finder<Long, User> find = new Finder<Long, User>(Long.class, User.class);
	
	@ManyToMany
	@JoinTable(
		      name="user_to_enquiry",
		      joinColumns=@JoinColumn(name="user_id", referencedColumnName="id"),
		      inverseJoinColumns=@JoinColumn(name="enquiry_id", referencedColumnName="id"))
	private final Set<Enquiry> enquiries = new HashSet<Enquiry>();

	public User(String _firstName, String _lastName, String _email, String _password, String _roleType) {
		firstName = StringUtils.properCase(_firstName);
		lastName = StringUtils.properCase(_lastName);
		email = StringUtils.getAllLowerCaseEmail(_email);
		password = getPassword(_password);
		roleType = _roleType;
	}
	
	public User(String _firstName, String _lastName, String _email, String _roleType) {
		firstName = StringUtils.properCase(_firstName);
		lastName = StringUtils.properCase(_lastName);
		email = StringUtils.getAllLowerCaseEmail(_email);
		password = getPassword(createPassword());
		roleType = _roleType;
	}
	
	private static String getPassword(String _password) {
		try {
			return PasswordHash.createHash(_password);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			e.printStackTrace();
		}
		
		return null;
	}


	private String createPassword() {
		SecureRandom random = new SecureRandom();
		byte bytes[] = new byte[20];
	    random.nextBytes(bytes);
	    return String.valueOf(random.nextInt());
	}


	public static User create(final UserForm form, String roleType) {
		final User user = new User(form.firstName, form.lastName, form.email, form.password, roleType);
		user.active = true;
		user.lastLogin = new Date();
		user.save();
		return user;
	}
	
//	public static User createAdmin(UserForm adminForm) {
//		User user = new User(adminForm.firstName, adminForm.lastName, adminForm.email, adminForm.password, Application.ADMIN);
//		user.active = true;
//		user.lastLogin = new Date();
//		user.save();
//		return user;
//	}
	
	public static User createSuperAdmin(String _firstName, String _lastName, String _email, String _password) {
		final User user = new User(_firstName, _lastName, _email, _password, Application.SUPER_ADMIN);
		user.active = true;
		user.lastLogin = new Date();
		user.save();
		return user;
	}

	public static User createAdmin(String _firstName, String _lastName, String _email, String _password) {
		final User user = new User(_firstName, _lastName, _email, _password, Application.ADMIN);
		user.active = true;
		user.lastLogin = new Date();
		user.save();
		return user;
	}
	
	public static User updateUserProfile(EditProfileForm form) {
		User user = Application.getLocalUser();
		user.firstName = form.firstName;
		user.lastName = form.lastName;
		user.email = form.email;
		user.save();
		return user;
	}


	public static User findByEmail(final String email) {
		if (email == null || email.isEmpty())
			return null;
		return find.where().eq("active", true).eq("email", StringUtils.getAllLowerCaseEmail(email)).findUnique();
	}

//	private static ExpressionList<User> findActiveUserByEmail(final String email) {
//		return find.where().eq("active", true).eq("email", StringUtils.getAllLowerCaseEmail(email));
//	}

	public static List<User> findAll() {
		return find.all();
	}
	
	public static void remove(String email) {
		User user = findByEmail(email);
		if (user != null)
			user.delete();
	}
	
	public static String getFullName(Long id) {
		return findById(id).getFullName();
	}
	
	public String getFullName() {
		return (firstName + " " + lastName).trim();
	}

	public String getName() {
    		return (firstName + " " + lastName).trim();
    }
	

	/**
     * Authenticate a User.
	 * @throws InvalidKeySpecException 
	 * @throws NoSuchAlgorithmException 
     */
    public static boolean authenticate(String email, String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
    	User user = find.where()
			        .eq("email", StringUtils.getAllLowerCaseEmail(email))
			        .findUnique();
    	if (user == null)
    		return false;
        return PasswordHash.validatePassword(password, user.password);
    }

    public static User findById(Long id) {
		return find.ref(id);
	}

	public static void changePassword(String _password) {
		User user = Application.getLocalUser();
		user.password = getPassword(_password);
		user.save();
	}

	public List<Enquiry> getPendingEnquiries() {
		List<Enquiry> enqList = new ArrayList<Enquiry>();
		for (Enquiry enq: getEnquiries()) {
			if (!enq.status.equals(Status.getValue(Status.CLOSED)) 
					&& enq.followUp.before(DateUtils.getTodaysDate()))
				enqList.add(enq);
		}
		return enqList;
	}
	
	public List<Enquiry> getFutueEnquiries() {
		List<Enquiry> enqList = new ArrayList<Enquiry>();
		for (Enquiry enq: getEnquiries()) {
			if (!enq.status.equals(Status.getValue(Status.CLOSED)) 
					&& enq.followUp.after(DateUtils.getTomorrowsDate()))
				enqList.add(enq);
		}
		return enqList;
	}
	
	public List<Enquiry> getTodaysEnquiries() {
		List<Enquiry> enqList = new ArrayList<Enquiry>();
		for (Enquiry enq: getEnquiries()) {
			if (!enq.status.equals(Status.getValue(Status.CLOSED))
					&& enq.followUp.before(DateUtils.getTodaysDate())
					&& enq.followUp.after(DateUtils.getTomorrowsDate()))
				enqList.add(enq);
		}
		return enqList;
	}

	public Set<Enquiry> getEnquiries() {
		return enquiries;
	}

	public void addEnquiry(Enquiry enquiry) {
		if (!this.enquiries.contains(enquiry)) {
			this.enquiries.add(enquiry);
			enquiry.addAssignee(this);
		}
	}
	
	public void removeEnquiry(Enquiry enquiry) {
		if (this.enquiries.contains(enquiry)) {
			this.enquiries.remove(enquiry);
			enquiry.removeAssignee(this);
		}
	}
    
}
