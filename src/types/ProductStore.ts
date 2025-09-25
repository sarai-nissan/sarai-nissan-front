import type { ProductType } from "./Product";

export interface ProductStoreType {
	products: ProductType[];
	isLoading: boolean;
	error: string | null;
	fetchProducts: (force?: boolean) => Promise<void>;
	clearProducts: () => void;
}
