package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Enquiry;

import org.codehaus.jackson.JsonNode;

import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import utils.EnumUtils;
import controllers.forms.NewEnquiryForm;
import flexjson.JSONSerializer;

@Security.Authenticated(Secured.class)
public class EnquiryController extends Controller{
	static Form<NewEnquiryForm> enquiryForm = Form.form(NewEnquiryForm.class);
	
	public static Result create() {
		JsonNode reqJson = request().body().asJson();
//		System.err.println(reqJson);
		Enquiry enquiry = Enquiry.create(reqJson);
		return ok(getJsonSerializedEnquiryObj(enquiry));
	}
	
	public static Result update(String enquiryId) {
		JsonNode reqJson = request().body().asJson();
		Enquiry enquiry = Enquiry.findById(Long.parseLong(enquiryId));
		Enquiry.update(enquiry, reqJson);
		return ok(getJsonSerializedEnquiryObj(enquiry));
	}
	
	public static Result show(String enquiryId) {
		Enquiry enq = Enquiry.findById(Long.parseLong(enquiryId));
		JSONSerializer postDetailsSerializer = new JSONSerializer();
//		return ok(postDetailsSerializer.exclude("comments.class").serialize(enq));
		return ok(postDetailsSerializer.include("comments").serialize(enq));
	}
	
	public static String getJsonSerializedEnquiryObj(Enquiry enq) {
		JSONSerializer postDetailsSerializer = new JSONSerializer();
//		return postDetailsSerializer.exclude("comments.class").serialize(enq);
		return postDetailsSerializer.include("comments").serialize(enq);
	}
	
	public static Result delete(String enquiryId) {
		JsonNode reqJson = request().body().asJson();
		System.err.println(reqJson);
		return UserController.addEnquiry();
	}
	
	public static Result getAllEnquiries() {
		JSONSerializer serializer = new JSONSerializer();
//		return ok(serializer.exclude("comments.class").serialize(Enquiry.findAll()));
		return ok(serializer.include("comments").include("assignees").exclude("password").serialize(Enquiry.findAll()));
	}
	
	public static Result getAllStatusList() {
		JSONSerializer postDetailsSerializer = new JSONSerializer();
		return ok(postDetailsSerializer.serialize(getStatusObjList()));
	}
	
	
	public static List<StatusObj> getStatusObjList() {
		if (statusObjList.isEmpty()) {
			for (String status: EnumUtils.statusList) {
				statusObjList.add(new StatusObj(status));
			}	
		}
		return statusObjList;
	}
	public static List<StatusObj> statusObjList = new ArrayList<StatusObj>();
	public static class StatusObj{
		public String status;
		public StatusObj(String _status) {
			this.status = _status;
		}
	}

}
