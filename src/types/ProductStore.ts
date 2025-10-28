import type { ProductType } from "./Product";

export interface ProductStoreType {
	products: ProductType[];
	isLoading: boolean;
	error: string | null;
	fetchProducts: (force?: boolean) => Promise<void>;
	checkProductUpdates: () => Promise<void>;
	clearProducts: () => void;
}
