package models;

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

import play.data.format.Formats;
import play.db.ebean.Model;

@Entity
public class Services extends Model {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;

	@Column(unique = true)
	public String name;

	@Formats.DateTime(pattern = "yyyy-MM-dd HH:mm:ss")
	public Date createdOn;

	@ManyToMany
	@JoinTable(name = "enquiry_services", 
						joinColumns = @JoinColumn(name = "enquiry_id", referencedColumnName = "id"), 
						inverseJoinColumns = @JoinColumn(name = "service_id", referencedColumnName = "id"))
	private final Set<Enquiry> enquiries = new HashSet<Enquiry>();

	public static void create(String _name) {
		Services service = new Services();
		service.name = _name;
		service.createdOn = new Date();
		service.save();
	}

	public static Finder<Long, Services> find = new Finder<Long, Services>(
			Long.class, Services.class);

	public static Services findById(Long id) {
		return find.ref(id);
	}

	public static Services findByName(String name) {
		return find.where().eq("name", name).findUnique();
	}

	public static List<Services> findAll() {
		return find.all();
	}

	public Set<Enquiry> getEnquiries() {
		return enquiries;
	}

	public void addEnquiry(Enquiry enquiry) {
		if (!this.enquiries.contains(enquiry)) {
			this.enquiries.add(enquiry);
			enquiry.addService(this);
		}
	}

	public void removeEnquiry(Enquiry enquiry) {
		if (this.enquiries.contains(enquiry)) {
			this.enquiries.remove(enquiry);
			enquiry.removeService(this);
		}
	}

}
