package models;

import javax.persistence.Entity;

import play.db.ebean.Model;

@Entity
public class EnquiryServices extends Model{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public Long enquiryId;
	
	public Long serviceId;
}
