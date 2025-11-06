import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getAllEvents, updateEventById } from "../api";
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
					const eventsData = await getAllEvents();

					const sortedData = (eventsData ?? []).sort((a: any, b: any) => {
						const parseDate = (d: string) => {
							if (!d) return 0;
							const [month, day, year] = d.split("-").map(Number);
							return new Date(year, month - 1, day).getTime();
						};

						const dateA = parseDate(a.date);
						const dateB = parseDate(b.date);

						return dateB - dateA;
					});

					set({ events: sortedData, isLoading: false });
				} catch (err) {
					console.error("❌ Fetch error:", err);
					set({ isLoading: false, error: "Failed to fetch events" });
				}
			},

			getEventById: (identifier: string | number) => {
				const { events } = get();
				return events.find(
					(e) =>
						e.id === Number(identifier) || e.documentId === String(identifier)
				);
			},

			updateEvent: async (documentId: string, updatedData: any) => {
				try {
					const updated = await updateEventById(documentId, updatedData);
					set((state) => ({
						events: state.events.map((e) =>
							e.documentId === documentId ? { ...e, ...updated.attributes } : e
						),
					}));
					return updated;
				} catch (err) {
					console.error("❌ Error updating event:", err);
					throw err;
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
