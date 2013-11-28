import models.User;
import play.Application;
import play.GlobalSettings;

public class Global extends GlobalSettings {

	public void onStart(Application app) {
		initialData();
	}

	private void initialData() {
		// Create Admin user if not present
		if (User.findByEmail("Shirish.g@mnemoniceducation.com") == null)
			User.createSuperAdmin("Shirish", "Gupta", "Shirish.g@mnemoniceducation.com", "shirishG");
	}
}