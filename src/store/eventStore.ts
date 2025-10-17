import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EventStoreType } from "../types/EventStore";

export const useEventStore = create<EventStoreType>()(
	persist(
		(set, get) => ({
			events: [],
			isLoading: false,
			error: null,

			fetchEvents: async (force = false) => {
				if (!force && get().events.length > 0) return;

				set({ isLoading: true, error: null });
				try {
					const res = await fetch(
						`${import.meta.env.VITE_STRAPI_API_URL}/api/events?populate=*`
					);

					if (!res.ok) throw new Error("Error fetching events");

					const data = await res.json();

					const sortedData = data.data.sort(
						(a: any, b: any) =>
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);

					set({ events: sortedData ?? [], isLoading: false });
				} catch (err) {
					console.error("Fetch error:", err);
					set({ isLoading: false, error: "Failed to fetch events" });
				}
			},

			clearEvents: () => set({ events: [] }),
		}),
		{
			name: "event-cache",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
