import type { EventType } from "./Event";

export interface EventStoreType {
	events: EventType[];
	isLoading: boolean;
	error: string | null;
	fetchEvents: (force?: boolean) => Promise<void>;
	getEventById: (identifier: string | number) => EventType | undefined;
	updateEvent: (id: string, updatedData: any) => Promise<any>;
	clearEvents: () => void;
}
