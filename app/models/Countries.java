package models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

import play.data.format.Formats;
import play.db.ebean.Model;

@Entity
public class Countries extends Model{
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
	
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(
		      name="enquiry_countries",
		      joinColumns=@JoinColumn(name="enquiry_id", referencedColumnName="id"),
		      inverseJoinColumns=@JoinColumn(name="country_id", referencedColumnName="id"))
	private final Set<Enquiry> enquiries = new HashSet<Enquiry>();

	public static void create(String _name) {
		Countries country = new Countries();
		country.name = _name;
		country.createdOn = new Date();
		country.save();
	} 
	
	public static Finder<Long, Countries> find = new Finder<Long, Countries>(Long.class, Countries.class);
	
	public static Countries findById(Long id) {
		return find.ref(id);
	}
	
	public static Countries findByName(String name) {
		return find.where().eq("name", name).findUnique();
	}
	
	public static List<Countries> findAll() {
		return find.all();
	}

	public void addEnquiry(Enquiry enquiry) {
		if (!this.enquiries.contains(enquiry)) {
			this.enquiries.add(enquiry);
			enquiry.addCountry(this);
		}
	}

	public Set<Enquiry> getEnquiries() {
		return enquiries;
	}

	public void removeEnquiry(Enquiry enquiry) {
		if (this.enquiries.contains(enquiry)) {
			this.enquiries.remove(enquiry);
			enquiry.removeCountry(this);
		}		
	}
}
