package models;

import javax.persistence.Entity;

import play.data.validation.Constraints.Required;
import play.db.ebean.Model;

@Entity
public class UserToEnquiry extends Model{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

//	@Id
//	public Long id;
	
	@Required
	public Long userId;
	
	@Required
	public Long enquiryId;
	
//	private Enquiry enquiry;
//	
//	private User user;

//	public static final Finder<Long, UserToEnquiry> find = new Finder<Long, UserToEnquiry>(Long.class, UserToEnquiry.class);
	
//	public UserToEnquiry(Long _userId, Long _enqId) {
//		this.userId = _userId;
//		this.enquiryId = _enqId;
//	}

//	public static UserToEnquiry create(Long _userId, Long _enqId) {
//		if (userExistsForEnquiry(_userId, _enqId))
//			return null;
////		UserToEnquiry obj = new UserToEnquiry(_userId, _enqId);
//		UserToEnquiry obj = new UserToEnquiry();
//		obj.save();
//		return obj;
//	}

//	public static List<UserToEnquiry> findByEnqId(Long enquiryId) {
//		return find.where().
//				eq("enquiryId", enquiryId).
//				findList();
//	}
//	
//	public static UserToEnquiry find(Long userId, Long enquiryId) {
//		return find.where().eq("enquiryId", enquiryId).eq("userId", userId).findUnique();
//	}
	
//	public static boolean userExistsForEnquiry(Long userId, Long enquiryId) {
//		return find(userId, enquiryId) != null;
//	}
//	
//	public static void delete(Long userId, Long enquiryId) {
//		UserToEnquiry obj = find(userId, enquiryId);
//		if (obj != null)
//			obj.delete();
//	}

//	@ManyToOne
//	public Enquiry getEnquiry() {
//		return enquiry;
//	}
//
//	@ManyToOne
//	public User getUser() {
//		return user;
//	}
}
