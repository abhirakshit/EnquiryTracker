package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import play.data.format.Formats;
import play.data.validation.Constraints.Required;
import play.db.ebean.Model;

@Entity
@Table(name = "comment")
public class Comment extends Model implements Comparable<Comment>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;
	
	@Required
	public Long creatorId;
	
	@Lob
	public String comment;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Enquiry enquiry;
	
	@Formats.DateTime(pattern = "yyyy-MM-dd HH:mm:ss")
	public Date createdOn;
	
	public static final Finder<Long, Comment> find = new Finder<Long, Comment>(Long.class, Comment.class);
	
	public static Comment create(Long creatorId, String comment) {
		Comment commentObj = new Comment();
		commentObj.comment = comment;
		commentObj.creatorId = creatorId; //Logged user not actual enquiry creator
		commentObj.createdOn = new Date();
		return commentObj;
	}
	
	@Override
	public int compareTo(Comment o) {
		if (this.createdOn.before(o.createdOn))
			return 1;
		return -1;
	}

	public Enquiry getEnquiry() {
		return enquiry;
	}
	
	public void setEnquiry(Enquiry _enquiry)  {
		this.enquiry = _enquiry;
		if (!enquiry.getComments().contains(this))
			enquiry.getComments().add(this);
	}

}
