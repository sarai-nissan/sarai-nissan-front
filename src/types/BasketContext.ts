import type { ProductType } from "./Product";

export interface BasketElement {
	id: string;
	quantity: number;
	product: ProductType;
	selectedPrice: string;
	selectedOption?: string;
}

export interface BasketContextType {
	basket: BasketElement[];
	addToBasket: (
		product: ProductType[],
		quantity: number,
		selectedPrice: string,
		selectedOption?: string
	) => void;
	removeFromBasket: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearBasket: () => void;
}
