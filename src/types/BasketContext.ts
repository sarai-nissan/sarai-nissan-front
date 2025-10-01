import type { ProductType } from "./Product";

export interface BasketElement {
	id: number;
	quantity: number;
	product: ProductType;
	selectedPrice: string;
	selectedOption?: string;
}

export interface BasketContextType {
	basket: BasketElement[];
	addToBasket: (
		product: ProductType,
		quantity: number,
		selectedPrice: string,
		selectedOption?: string
	) => void;
	removeFromBasket: (id: number) => void;
	updateQuantity: (id: number, quantity: number) => void;
	clearBasket: () => void;
}
