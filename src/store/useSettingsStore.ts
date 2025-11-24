import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getTaxPercent, getShippingOptions } from "../api";
import type {
	SettingsStore,
	ShippingOption,
	TaxPercent,
} from "../types/useSettingsStoreTypes";

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set, get) => ({
			taxPercent: null,
			shippingOptions: [],
			usDelivery: [],
			internationalDelivery: [],

			isLoading: false,
			error: null,

			fetchSettings: async (force = false) => {
				const state = get();

				if (
					!force &&
					state.shippingOptions.length > 0 &&
					state.taxPercent !== null
				) {
					console.log("✅ Using cached shipping & tax settings");
					return;
				}

				set({ isLoading: true, error: null });

				try {
					const [taxRecord, shippingList] = await Promise.all([
						getTaxPercent(),
						getShippingOptions(),
					]);

					const taxPercent: TaxPercent | null =
						taxRecord &&
						typeof taxRecord === "object" &&
						"taxPercent" in taxRecord
							? taxRecord
							: null;

					const usDelivery = shippingList.filter(
						(opt: ShippingOption) => opt.type === "US"
					);

					const internationalDelivery = shippingList.filter(
						(opt: ShippingOption) => opt.type === "International"
					);

					set({
						taxPercent,
						shippingOptions: shippingList,
						usDelivery,
						internationalDelivery,
						isLoading: false,
					});
				} catch (err) {
					console.error("❌ Error fetching settings:", err);
					set({
						isLoading: false,
						error: "Failed to load shipping & tax settings",
					});
				}
			},

			clearSettings: () =>
				set({
					taxPercent: null,
					shippingOptions: [],
					usDelivery: [],
					internationalDelivery: [],
				}),
		}),
		{
			name: "settings-cache",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
