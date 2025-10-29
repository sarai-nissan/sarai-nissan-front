import type { CalendarEvent } from "../types/Event";

export const slugify = (text: string) => {
	return text
		.toString()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const formatDateToMonthName = (
	dateString: string
): {
	month: string;
	day: string;
	year: string;
} => {
	const [month, day, year] = dateString.split("-");
	const monthNames = [
		"january",
		"february",
		"march",
		"april",
		"may",
		"june",
		"july",
		"august",
		"september",
		"october",
		"november",
		"december",
	];
	const monthIndex = parseInt(month, 10) - 1;
	if (monthIndex < 0 || monthIndex > 11) {
		return { month: "Invalid month", day: "", year: "" };
	}
	return { month: monthNames[monthIndex], day, year };
};

export const addToGoogleCalendar = ({
	eventName,
	additionalInfo,
	city,
	venueName,
	date,
	time,
}: CalendarEvent) => {
	const [month, day, year] = date.split("-").map(Number);

	const cleanTime = time.replace(/\s+/g, " ").replace(/\u202F/g, " ");
	const [startTime, endTime] = cleanTime.split(" - ").map((t) => t.trim());

	function parseTime(t: string) {
		const match = t.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
		if (!match) return null;
		let [, hours, minutes, ampm] = match;
		let h = parseInt(hours, 10);
		const m = parseInt(minutes, 10);
		if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
		if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
		return { hours: h, minutes: m };
	}

	const start = parseTime(startTime);
	const end = parseTime(endTime);

	if (!start || !end) {
		console.error("Error parsing time:", time);
		return;
	}

	const startDate = new Date(year, month - 1, day, start.hours, start.minutes);
	const endDate = new Date(year, month - 1, day, end.hours, end.minutes);

	const formatDate = (date: Date) => {
		const pad = (n: number) => n.toString().padStart(2, "0");
		return (
			date.getFullYear().toString() +
			pad(date.getMonth() + 1) +
			pad(date.getDate()) +
			"T" +
			pad(date.getHours()) +
			pad(date.getMinutes()) +
			pad(date.getSeconds())
		);
	};

	const url = new URL("https://www.google.com/calendar/render");
	url.searchParams.set("action", "TEMPLATE");
	url.searchParams.set("text", eventName);
	url.searchParams.set("details", additionalInfo || "");
	url.searchParams.set(
		"location",
		`${venueName ? venueName + "," : ""} ${city || ""}`
	);
	url.searchParams.set(
		"dates",
		`${formatDate(startDate)}/${formatDate(endDate)}`
	);

	window.open(url.toString(), "_blank");
};

export const validateEmail = (email: string) => {
	var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return regex.test(email);
};

export const formatDate = (
	dateString: string,
	options:
		| "year"
		| "month"
		| "day"
		| "hour"
		| "minute"
		| "second"
		| "weekday"
		| "monthName"
		| "full"
		| "short"
		| "time"
		| "iso",
	locale: string = "en-US"
) => {
	if (!dateString) return null;

	const date = new Date(dateString);

	switch (options) {
		case "year":
			return date.getFullYear();

		case "month":
			return date.getMonth() + 1;

		case "day":
			return date.getDate();

		case "hour":
			return date.getHours();

		case "minute":
			return date.getMinutes();

		case "second":
			return date.getSeconds();

		case "weekday":
			return date.toLocaleDateString(locale, { weekday: "long" });

		case "monthName":
			return date.toLocaleDateString(locale, { month: "long" });

		case "time":
			return date.toLocaleTimeString(locale, {
				hour: "2-digit",
				minute: "2-digit",
			});

		case "short":
			return date.toLocaleDateString(locale, {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
			});

		case "full":
			return date.toLocaleDateString(locale, {
				day: "numeric",
				month: "long",
				year: "numeric",
			});

		case "iso":
			return date.toISOString();

		default:
			return date.toString();
	}
};
