package utils;

import java.util.ArrayList;
import java.util.List;

import controllers.EnquiryController.StatusObj;

public class EnumUtils {
	public enum Courses {
		GRE("GRE"), 
		GMAT("GMAT"), 
		SAT("SAT"), 
		TOEFL("TOEFL"),
		IELTS("IELTS"),
		APPLICATION("Application"),
		VISA("Visa");
		
		private String value;
        private Courses(String value) {
                this.value = value;
        }
        
        public static String getValue(Courses course) {
        	return course.value;
        }
        
        public static Courses getType(String _course) {
        	for(Courses course: Courses.values()){
        		if (course.value.equals(_course))
        			return course;
        	}
        		
        	return null;
        }
	}
	
	public enum Countries {
		USA("USA"), 
		UK("UK"), 
		AUS_NZ("Aus/NZ"), 
		CANADA("Canada"),
		EUROPE("Europe"),
		SINGAPORE("Singapore"),
		INDIA("India");
		
		
		private String value;
        private Countries(String value) {
                this.value = value;
        }
        public static String getValue(Countries country) {
        	return country.value;
        }
        
        public static Countries getType(String cntry) {
        	for(Countries country: Countries.values()){
        		if (country.value.equals(cntry))
        			return country;
        	}
        		
        	return null;
        }
	}
	
	public enum SearchTypes {
		EMAIL("Email"), 
		CONTACT_NUMBER("Contact Number"), 
		FIRST_NAME("First Name"), 
		LAST_NAME("Last Name");
		
		private String value;
        private SearchTypes(String value) {
                this.value = value;
        }
        public static String getValue(SearchTypes type) {
        	return type.value;
        }
        
        public static SearchTypes getType(String type) {
        	for(SearchTypes sType: SearchTypes.values()){
        		if (sType.value.equals(type))
        			return sType;
        	}
        		
        	return null;
        }
	}
	
	
	public enum Status {
		NPU("Not Picking Up"), 
		IN_PROGRESS("In-Progress"), 
		CLOSED("Closed"),
		JOINED("Joined"), 
		TOOK_REQ("Took Requirements"),
		VISITED("Visited"),
		EXPECTED_WALK_IN("Expected Walk-In"),
		TO_CALL("To Call"),
		ENROLLED("Enrolled");
		
		
		private String value;
        private Status(String value) {
                this.value = value;
        }
        
        public static String getValue(Status status) {
        	return status.value;
        }
        
        public static Status getStatus(String value) {
        	
        	for (Status status: Status.values()) {
        		if (status.value.equals(value))
        			return status;
        	}
        	
        	return null;
        }
	}

	
	public static List<String> statusList = new ArrayList<String>();
	public static List<String> searchTypeList = new ArrayList<String>();
	public static List<String> countryList = new ArrayList<String>();
	public static List<String> courseList = new ArrayList<String>();
	
	static {
		for (Status status: Status.values()) {
			statusList.add(status.value);
		}
		
		for (SearchTypes sTypes: SearchTypes.values())
			searchTypeList.add(sTypes.value);
		
		for (Countries country: Countries.values())
			countryList.add(country.value);
		
		for (Courses course: Courses.values())
			courseList.add(course.value);
	}
	
}
