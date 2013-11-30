package controllers;

import models.Enquiry;
import flexjson.JSONSerializer;

public class Utils {
	
	public static String getJsonSerializedEnquiryObj(Enquiry enq) {
		JSONSerializer postDetailsSerializer = new JSONSerializer();
//		return postDetailsSerializer.exclude("comments.class").serialize(enq);
		return postDetailsSerializer.include("comments").serialize(enq);
	}

}
