package models;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import play.data.format.Formats;
import play.data.validation.Constraints.Email;
import play.data.validation.Constraints.Required;
import play.db.ebean.Model;
import utils.DateUtils;
import utils.EnumUtils.SearchTypes;
import utils.EnumUtils.Status;
import controllers.Application;

@Entity
@Table(name = "enquiry")
public class Enquiry extends Model{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public Long id;
	
	@Required
	public Long creatorId;
	
//	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "enquiry")
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "enquiry")
	private final Set<Comment> comments = new HashSet<Comment>();
	
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "enquiries")
	private final Set<User> assignees = new HashSet<User>();
	
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "enquiries")
	private final Set<Countries> countries = new HashSet<Countries>();
	
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "enquiries")
	private final Set<Services> services = new HashSet<Services>();
	
	@Required
	public String firstName;
	
	public String lastName;
	
	@Required
	public String contactNumber;
	
	@Lob
	public String address;
	
	@Email
	public String email;
	
	public String courseType;
	
	public String countryInterested;
	
	//X
	public String highSchoolScore;
	
	//X+2
	public String seniorSecondaryScore;
	
	public String graduationScore;
	
	public String testScores;
	
	public String program;
	
	public String intake;
	
	public String source;
	@Lob
	public String remarks;
	
	@Required
	@Formats.DateTime(pattern = "yyyy-MM-dd HH:mm:ss")
	public Date followUp;

	@Formats.DateTime(pattern = "yyyy-MM-dd HH:mm:ss")
	public Date createdOn;
	
	@Formats.DateTime(pattern = "yyyy-MM-dd HH:mm:ss")
	public Date modifiedOn;
	
	public String status;

	public static Finder<Long, Enquiry> find = new Finder<Long, Enquiry>(Long.class, Enquiry.class);
	 
	public static Enquiry create(JsonNode enquiryJson) {
		System.out.println("Create: " + enquiryJson);
		Enquiry enquiry = new Enquiry();
		updateFields(enquiry, enquiryJson, false);
//		updateAssignees(enquiry, enquiryForm);
//		updateCountries(enquiry, enquiryForm);
//		updateServices(enquiry, enquiryForm);
//		addComments(enquiry, enquiryForm, false, "");
		enquiry.save();
		return enquiry;
	}
	
	public static void update(Enquiry enquiry, JsonNode enquiryJson) {
		System.out.println("Update: " + enquiryJson);
		updateFields(enquiry, enquiryJson, true);
		enquiry.update();
	}
	
	private static List<String> updateServices(Enquiry enquiry, List<Integer> newServicesIdList) {
		List<Long> newAssignedServices = new ArrayList<Long>();
		
		for (Integer id: newServicesIdList) {
			newAssignedServices.add(id.longValue());
		}
		
		List<Services> copy = new ArrayList<Services>(enquiry.getServices());
		for (Services service: enquiry.getServices()) {
			if (newAssignedServices.contains(service.id)) {
				newAssignedServices.remove(service.id);
				copy.remove(service);
			}
		}
		
		List<String> changes = new ArrayList<String>();
		//Remove old
		for (Services service: copy) {
			enquiry.removeService(service);
			changes.add("<i>Service Removed</i>: " + service.name);
		}
		
		//Create new
		for (Long id: newAssignedServices) {
			Services service = Services.findById(id);
			enquiry.addService(service);
			changes.add("<i>Service Added</i>: " + service.name);
		}
		
		return changes;
	
	}
	
	private static List<String> updateCountries(Enquiry enquiry,  List<Integer> newCountriesIdList) {
		List<Long> newAssignedCountries = new ArrayList<Long>();
		
		for (Integer id: newCountriesIdList) {
			newAssignedCountries.add(id.longValue());
		}

		List<Countries> copy = new ArrayList<Countries>(enquiry.getCountries());
		for (Countries country: enquiry.getCountries()) {
			if (newAssignedCountries.contains(country.id)) {
				newAssignedCountries.remove(country.id);
				copy.remove(country);
			}
		}
		
		List<String> changes = new ArrayList<String>();
		//Remove old
		for (Countries country: copy) {
			enquiry.removeCountry(country);
			changes.add("<i>Country Removed</i>: " + country.name);
		}
		
		//Create new
		for (Long id: newAssignedCountries) {
			Countries country = Countries.findById(id);
			enquiry.addCountry(country);
			changes.add("<i>Country Added</i>: " + country.name);
		}
		
		return changes;
		
	}

	private static List<String> updateAssignees(Enquiry enquiry, List<Integer> newAssigneeIdList) {
		List<Long> newAssignedIdList = new ArrayList<Long>();
		
		for (Integer id: newAssigneeIdList) {
			newAssignedIdList.add(id.longValue());
		}
		
		List<User> copy = new ArrayList<User>(enquiry.getAssignees());
		for (User assignee: enquiry.getAssignees()) {
			if (newAssignedIdList.contains(assignee.id)) {
				newAssignedIdList.remove(assignee.id);
				copy.remove(assignee);
			}
		}
		
		List<String> changes = new ArrayList<String>();
		//Remove old
		for (User user: copy) {
			enquiry.removeAssignee(user);
			changes.add("<i>Assignee Removed</i>: " + user.getFullName());
		}
		
		//Create new
		for (Long id: newAssignedIdList) {
			User user = User.findById(id);
			enquiry.addAssignee(user);
			changes.add("<i>Assignee Added</i>: " + user.getFullName());
		}
		
		return changes;
	}

	private static void updateFields(Enquiry enquiry, JsonNode enquiryForm, boolean isUpdate) {
		
		ObjectMapper mapper = new ObjectMapper();
		try {
			String _firstName = enquiryForm.get("firstName").asText();
			String _lastName = enquiryForm.get("lastName").asText();
			String _email = enquiryForm.get("email").asText();
			String _address = enquiryForm.get("address").asText();
			String _contactNumber = enquiryForm.get("contactNumber").asText();
			Date _followup = new Date(enquiryForm.get("followUp").asLong());
			String _status = enquiryForm.get("status").asText();
			String _hss = enquiryForm.get("highSchoolScore").asText();
			String _sss = enquiryForm.get("seniorSecondaryScore").asText();
			String _intake = enquiryForm.get("intake").asText();
			String _gs = enquiryForm.get("graduationScore").asText();
			String _program = enquiryForm.get("program").asText();
			String _testScores = enquiryForm.get("testScores").asText();
			String _remarks = enquiryForm.get("remarks").asText();
			String _source = enquiryForm.get("source").asText();
			String _comments = enquiryForm.get("comments").asText();
		
		
			List<Integer> assigneeIdList = mapper.readValue(enquiryForm.get("assignedTo"), ArrayList.class);
			List<Integer> countryIdList = mapper.readValue(enquiryForm.get("countriesInterested"), ArrayList.class);
			List<Integer> serviceIdList = mapper.readValue(enquiryForm.get("servicesInterested"), ArrayList.class);
		
			List<String> serviceChanges = updateServices(enquiry, serviceIdList);
			List<String> assigneeChanges = updateAssignees(enquiry, assigneeIdList);
			List<String> countryChanges = updateCountries(enquiry, countryIdList);
			
			// Create change list
			List<String> changes = new ArrayList<String>();
			
			if (isUpdate) {
				changes.add(updateString("First Name", enquiry.firstName, _firstName));
				changes.add(updateString("Last Name", enquiry.lastName, _lastName));
				changes.add(updateString("Email", enquiry.email, _email));
				changes.add(updateString("Address", enquiry.address, _address));
				changes.add(updateString("Contact number", enquiry.contactNumber, _contactNumber));
				changes.add(updateDate("Follow up", enquiry.followUp, _followup));
				changes.add(updateString("Status", enquiry.status, _status));
				changes.add(updateString("X Score", enquiry.highSchoolScore, _hss));
				changes.add(updateString("XII Score", enquiry.seniorSecondaryScore, _sss));
				changes.add(updateString("Intake", enquiry.intake, _intake));
				changes.add(updateString("Grad Score", enquiry.graduationScore, _gs));
				changes.add(updateString("Program", enquiry.program, _program));
				changes.add(updateString("Test Scores", enquiry.testScores, _testScores));
				changes.add(updateString("Remarks", enquiry.remarks, _remarks));
				changes.add(updateString("Source", enquiry.source, _source));
				
				if (!_comments.isEmpty()) {
					changes.add("<i>Comment Added:</i> " + _comments);
				}
				
				changes.addAll(countryChanges);
				changes.addAll(assigneeChanges);
				changes.addAll(serviceChanges);
				changes.removeAll(Arrays.asList("", null));
			}
			
			//Update Fields
			enquiry.firstName = _firstName;
			enquiry.lastName = _lastName;
			enquiry.email = _email;
			enquiry.address = _address;
			enquiry.contactNumber = _contactNumber;
			enquiry.followUp = _followup;
			enquiry.status = _status;
			enquiry.highSchoolScore = _hss;
			enquiry.seniorSecondaryScore = _sss;
			enquiry.intake = _intake;
			enquiry.graduationScore = _gs;
			enquiry.program = _program;
			enquiry.testScores = _testScores;
			enquiry.remarks = _remarks;
			enquiry.source = _source;
			
			enquiry.modifiedOn = new Date();
			if (!isUpdate)
				enquiry.createdOn = enquiry.modifiedOn;
			
			enquiry.creatorId = Application.getLocalUser().id; // Logged user is the creator
			enquiry.addComment(getComment(isUpdate, enquiry, changes));
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	private static Comment getComment(boolean isUpdate, Enquiry enquiry, List<String> changes) {
		StringBuilder commentStr = new StringBuilder();
		if (!isUpdate) {
			commentStr.append("Enquiry Created!<br>");
			// Create comment if the user has added one.
			if (enquiry.comments != null && !enquiry.comments.isEmpty())
				commentStr.append(enquiry.comments);
		} else {
			if (changes != null && !changes.isEmpty()) {
				for (String change : changes)
					commentStr.append(change).append("<br>");
			}
		}

		Comment newComment = Comment.create(enquiry.creatorId, commentStr.toString());
		return newComment;
	}
	
	private static String updateDate(String property, Date oldVal, Date newVal) {
		if (newVal == null || newVal.equals(oldVal)) 
			return null;
		return "<i>" + property + "</i>" + " changed from " + DateUtils.getPrettyFormattedDeadlineStr(oldVal) + " to " + DateUtils.getPrettyFormattedDeadlineStr(newVal);
	}

	private static String updateString (String property, String oldVal, String newVal) {
		if (newVal == null || newVal.isEmpty() || newVal.equals(oldVal)) 
			return null;
		if (oldVal == null || oldVal.isEmpty())
			return "<i>" + property + "</i>" + " added " + newVal;
		
		return "<i>" + property + "</i>" + " changed from " + oldVal + " to " + newVal;
	}

//	private static String formatChanges(List<String> changes) {
//		StringBuffer buff = new StringBuffer();
//		for (String change: changes) {
//			buff.append("<br>").append(change);
//		}
//		return buff.toString();
//	}

	public static List<Enquiry> findAll() {
		return find.all();
	}
	
	public static Enquiry findById(Long id) {
		return find.ref(id);
	}
	
	public static List<Enquiry> findAllNonClosed() {
		return find.where()
				.ne("status", Status.getValue(Status.CLOSED))
				.findList();
	}
	
	public static List<Enquiry> findAllClosed() {
		return find.where()
				.eq("status", Status.getValue(Status.CLOSED))
				.findList();
	}
	
	
	public static List<Enquiry> getAllPendingUserEnquiries() {
		return find.where()
				.lt("followUp", DateUtils.getTodaysDate())
				.ne("status", Status.getValue(Status.CLOSED))
				.findList();
	}
	
	public static List<Enquiry> getAllFutueUserEnquiries() {
		return find.where()
				.gt("followUp", DateUtils.getTomorrowsDate())
				.ne("status", Status.getValue(Status.CLOSED))
				.findList();
	}
	
	public static List<Enquiry> getTodaysUserEnquiries() {
		return find.where()
				.gt("followUp", DateUtils.getTodaysDate())
				.lt("followUp", DateUtils.getTomorrowsDate())
				.ne("status", Status.getValue(Status.CLOSED))
				.findList();
	}
	
	public static List<Enquiry> findByContactNumber(String contactNumber) {
		return find.where()
				.eq("contactNumber", contactNumber)
				.findList();
	}
	
	public static List<Enquiry> findByFirstName(String firstName) {
		return find.where()
				.eq("firstName", firstName)
				.findList();
	}
	
	public static List<Enquiry> findByLastName(String lastName) {
		return find.where()
				.eq("lastName", lastName)
				.findList();
	}
	
	public static List<Enquiry> findByEmail(String email) {
		return find.where()
				.eq("email", email)
				.findList();
	}
	
	public static List<Enquiry> search(String searchVal, String searchBy) {
		if (SearchTypes.EMAIL == SearchTypes.getType(searchBy))
			return findByEmail(searchVal);
		if (SearchTypes.CONTACT_NUMBER == SearchTypes.getType(searchBy))
			return findByContactNumber(searchVal);
		if (SearchTypes.FIRST_NAME == SearchTypes.getType(searchBy))
			return findByFirstName(searchVal);
		if (SearchTypes.LAST_NAME == SearchTypes.getType(searchBy))
			return findByLastName(searchVal);
		
		return null;
	}

	public List<String> getCommentHistory(Long enquiryId) {
		List<String> commentHistoryList = new ArrayList<String>();

		List<Comment> comments = new ArrayList<Comment>(Enquiry.findById(enquiryId).getComments());
		Collections.sort(comments);
		for (Comment comment: comments) {
			StringBuffer buff = new StringBuffer();
			buff.append("<b>" + DateUtils.getDateFormattedFollowUpStr(comment.createdOn) + "</b>");
			buff.append(" [<i>" + User.getFullName(comment.creatorId) + "</i>]: ");
			buff.append(comment.comment);
			commentHistoryList.add(buff.toString());
		}
		return commentHistoryList;
	}
	
	public List<User> getAssigneeList() {
		return new ArrayList<User>(getAssignees());
	}
	
	public String getAssigneeNames() {
		StringBuilder strBldr = new StringBuilder();

		for (User user: getAssignees()) {
			strBldr.append(user.getFullName()).append(", ");
		}
		
		return strBldr.replace(strBldr.lastIndexOf(","), strBldr.length(), "").toString();
	}

	
	public void addComment(Comment comment) {
		this.comments.add(comment);
		if (comment.getEnquiry() != this)
			comment.setEnquiry(this);
//		comment.save();
	}
	
	public String getFullName() {
		return (firstName + " " + lastName).trim();
	}

    public String getName() {
		return (firstName + " " + lastName).trim();
	}
	
	// GETTERS
	
	public Set<Comment> getComments() {
		return comments;
	}

	public Set<User> getAssignees() {
		return assignees;
	}
	
	public void addAssignee(User assignee) {
		if (!this.assignees.contains(assignee)) {
			this.assignees.add(assignee);
			assignee.addEnquiry(this);
		}
	}
	
	public void removeAssignee(User assignee) {
		if (this.assignees.contains(assignee)) {
			this.assignees.remove(assignee);
			assignee.removeEnquiry(this);
		}
	}

	public Set<Services> getServices() {
		return services;
	}
	
	public String getServiceNames() {
		StringBuilder sb = new StringBuilder();
		for (Services service: getServices()) {
			sb.append(service.name + ", ");
		}
		
		if (sb.toString().isEmpty())
			return "";
		
		return sb.replace(sb.lastIndexOf(","), sb.length(), "").toString();
	}
	
	public String getCountryNames() {
		StringBuilder sb = new StringBuilder();
		for (Countries country: getCountries()) {
			sb.append(country.name + ", ");
		}
		
		if (sb.toString().isEmpty())
			return "";
		
		return sb.replace(sb.lastIndexOf(","), sb.length(), "").toString();
	}
	

	public void addService(Services service) {
		if (!this.services.contains(service)) {
			this.services.add(service);
			service.addEnquiry(this);
		}
		
	}
	
	public void removeService(Services service) {
		if (this.services.contains(service)) {
			this.services.remove(service);
			service.removeEnquiry(this);
		}
	}

	public Set<Countries> getCountries() {
		return countries;
	}


	public void addCountry(Countries country) {
		if (!this.countries.contains(country)) {
			this.countries.add(country);
			country.addEnquiry(this);
		}
	}
	
	public void removeCountry(Countries country) {
		if (this.countries.contains(country)) {
			this.countries.remove(country);
			country.removeEnquiry(this);
		}
	}
	
}
