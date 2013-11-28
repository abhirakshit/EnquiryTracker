package controllers;

import java.util.List;

import models.Services;
import flexjson.JSONSerializer;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;

@Security.Authenticated(Secured.class)
public class ServiceController extends Controller{
	public static Result all() {
		List<Services> serviceList = Services.findAll();
		JSONSerializer postDetailsSerializer = new JSONSerializer();
		return ok(postDetailsSerializer.serialize(serviceList));
	}
}
