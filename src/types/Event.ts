export type EventType = {
	date: string;
	day: string;
	time: string;
	eventName: string;
	city: string;
	venueName?: string;
	additionalInfo?: string;
	purchaseTicketsLink?: string;
	buttonText?: string;
	createdAt?: string;
	updatedAt?: string;
	publishedAt?: string;
	documentId?: string;
	id?: number;
};

export type CalendarEvent = {
	eventName: string;
	additionalInfo?: string;
	city: string;
	venueName?: string;
	date: string;
	time: string;
};
