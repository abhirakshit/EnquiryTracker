package utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {
	
	public static String getPrettyFormattedDeadlineStr(Date deadline) {
		return formatDate(deadline, "EEE, MMM d");
//		PrettyTime p = new PrettyTime();
//		return p.format(deadline);
	}

	public static String getDateFormattedFollowUpStr(Date deadline) {
		return formatDate(deadline, "EEE, MMM d, hh:mm aa");
	}
	
	public static String getDateFormattedFormStr(Date deadline) {
		return formatDate(deadline, "MM/dd/yyyy hh:mm:ss aa");
	}
	
	public static String getTodaysDateFormattedFormStr() {
		return getDateFormattedFormStr(new Date());
	}
	
	private static String formatDate(Date date, String format) {
		if (date == null)
			date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		return formatter.format(date);
	}
	
	public static Date getTodaysDate() {
		return getMidnightCalender().getTime();
	}
	
	public static Date getTomorrowsDate() {
		Calendar cal = getMidnightCalender();
		cal.add(Calendar.DATE, 1);
		return cal.getTime();
	}
	
	public static Date getYesterdaysDate() {
		Calendar cal = getMidnightCalender();
		cal.add(Calendar.DATE, -1);
		return cal.getTime();
	}
	
	public static Calendar getMidnightCalender() {
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal;
	}

}
