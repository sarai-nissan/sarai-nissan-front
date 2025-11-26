import type { usDeliveryType, internationalDeliveryType } from "../constants";
import type { BasketElement } from "./BasketContext";

export type DeliveryId = (
	| typeof usDeliveryType
	| typeof internationalDeliveryType
)[number]["uid"];

export interface OrderForm {
	email: string;
	delivery: DeliveryId;
	firstName: string;
	lastName: string;
	phone: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

export interface OrderData {
	form: OrderForm;
	basketItems: BasketElement[];
}

export interface OrderContextProps {
	order: OrderData | null;
	setOrder: (data: OrderData) => void;
	clearOrder: () => void;
	initOrderFromBasket: (
		items: BasketElement[],
		partialForm?: Partial<OrderForm>
	) => OrderData;
}
