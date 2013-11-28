package controllers.forms;

import java.util.Date;
import java.util.Set;

import javax.persistence.Lob;

import play.data.validation.Constraints.Email;
import play.data.validation.Constraints.Required;

/*
 * This class is made specifically as Enquiry does not contain comments. 
 * EnquiryForm will capture Comment and Enquiry data and maybe momre later
 */
public class NewEnquiryForm {
//	@Required
//	public Long creatorId;
//
//	@Required
//	public Long assignedTo;
//	public Long assignedTo1;
//	public Long assignedTo2;

	@Required
	public String firstName;

	public String lastName;
	
	public Set<Long> countriesInterested;

//	@Required
//	public String contactNumber;
//
//	@Lob
//	public String address;
//
//	@Email
//	public String email;

//	public String courseType;
	
//	public Long service;
//	public Long service1;
//	public Long service2;

//	public Long countryInterested;
//	public Long countryInterested1;
//	public Long countryInterested2;

//	@Lob
//	public String comments;
//
//	@Required
//	// @Formats.DateTime(pattern = "dd/MM/yyyy HH:mm:ss aa")
//	public Date followUp;
//
//	public String status;
//
//	// X
//	public String highSchoolScore;
//
//	// X+2
//	public String seniorSecondaryScore;
//
//	public String graduationScore;
//
//	public String testScores;
//
//	public String program;
//
//	public String intake;
//	
//	public String source;
//	
//	public String remarks;
}
