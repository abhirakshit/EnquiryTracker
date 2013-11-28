package utils;

public class StringUtils {
	
	public static String getAllLowerCaseEmail(String email) {
		return email.toLowerCase();
	}
	
	public static String properCase (String inputVal) {
	    // Empty strings should be returned as-is.

	    if (inputVal.length() == 0) return "";

	    // Strings with only one character uppercased.

	    if (inputVal.length() == 1) return inputVal.toUpperCase();

	    // Otherwise uppercase first letter, lowercase the rest.

	    return inputVal.substring(0,1).toUpperCase()
	        + inputVal.substring(1).toLowerCase();
	}

}
