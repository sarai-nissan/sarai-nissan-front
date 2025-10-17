import type { EventType } from "./Event";

export interface EventStoreType {
	events: EventType[];
	isLoading: boolean;
	error: string | null;
	fetchEvents: (force?: boolean) => Promise<void>;
	clearEvents: () => void;
}
