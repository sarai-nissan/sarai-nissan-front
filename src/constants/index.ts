import type { CategoryType } from "../types/FilterContextTypes";

export const categories: CategoryType[] = [
	"All",
	"Prints",
	"Tarot & Oracle Decks",
];

export const taxesPercent = 0.097;

export const usDeliveryType = [
	{
		id: "ground",
		label: "USPS Ground Advantage",
		price: 12,
	},
	{
		id: "express",
		label: "USPS Express Shipping",
		price: 32,
	},
] as const;

export const internationalDeliveryType = [
	{
		id: "basic",
		label: "USPS International Basic",
		price: 0.5,
	},
	{
		id: "sipping",
		label: "USPS Express Shipping International",
		price: 92,
	},
] as const;

export const shippedCountries = ["US", "CA"];

export const countryNames: Record<string, string> = {
	US: "United States",
	CA: "Canada",
};
