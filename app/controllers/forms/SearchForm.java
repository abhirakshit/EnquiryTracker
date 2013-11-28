package controllers.forms;

import play.data.validation.Constraints.Required;

public class SearchForm {

	@Required
	public String searchBy;
	@Required
	public String searchVal;
}
