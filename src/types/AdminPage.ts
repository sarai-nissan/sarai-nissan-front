import type { BasketElement } from "./BasketContext";
import type { OrderForm } from "./OrderContext";

export type Order = {
	id?: number;
	documentId?: string;
	basket: BasketElement[];
	createdAt?: string;
	archived: boolean;
} & OrderForm;
