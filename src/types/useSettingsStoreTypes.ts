export type DeliveryRegion = "US" | "International";

export interface ShippingOption {
	id: string;
	label: string;
	price: number;
	type: DeliveryRegion;
	documentId: string;
	uid: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string | null;
}

export interface TaxPercent {
	createdAt: string;
	documentId: string;
	id: number;
	publishedAt: string;
	taxPercent: number;
	updatedAt: string;
}

export interface SettingsStore {
	taxPercent: TaxPercent | null;
	shippingOptions: ShippingOption[];
	usDelivery: ShippingOption[];
	internationalDelivery: ShippingOption[];

	isLoading: boolean;
	error: string | null;

	fetchSettings: (force?: boolean) => Promise<void>;
	clearSettings: () => void;
}
