import type { CategoryType } from "../types/FilterContextTypes";

export const apiUrl = import.meta.env.VITE_STRAPI_API_URL;

export const categories: CategoryType[] = [
	"All",
	"Prints",
	"Tarot & Oracle Decks",
];

export const taxesPercent = 0.097;

export const usDeliveryType = [
	{
		uid: "ground",
		label: "USPS Ground Advantage",
		price: 12,
	},
	{
		uid: "express",
		label: "USPS Express Shipping",
		price: 55,
	},
] as const;

export const internationalDeliveryType = [
	{
		uid: "basic",
		label: "USPS International Basic",
		price: 39,
	},
	{
		uid: "shipping",
		label: "USPS Express Shipping International",
		price: 100,
	},
] as const;

export const shippedCountries = [
	"US",
	"CA",
	"GB",
	"DE",
	"FR",
	"AU",
	"ES",
	"IT",
	"NL",
	"SE",
	"NO",
	"CH",
	"JP",
	"SG",
];

export const countryNames: Record<string, string> = {
	US: "United States",
	CA: "Canada",
	GB: "United Kingdom",
	DE: "Germany",
	FR: "France",
	AU: "Australia",
	ES: "Spain",
	IT: "Italy",
	NL: "Netherlands",
	SE: "Sweden",
	NO: "Norway",
	CH: "Switzerland",
	JP: "Japan",
	SG: "Singapore",
};
