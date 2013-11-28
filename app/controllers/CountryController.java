package controllers;

import java.util.List;

import flexjson.JSONSerializer;
import models.Countries;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;

@Security.Authenticated(Secured.class)
public class CountryController extends Controller{

	public static Result all() {
		List<Countries> countryList = Countries.findAll();
		JSONSerializer postDetailsSerializer = new JSONSerializer();
		return ok(postDetailsSerializer.serialize(countryList));
	}
}
