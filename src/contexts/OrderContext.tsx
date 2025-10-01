import React, { createContext, useContext, useState, useEffect } from "react";
import type {
	OrderContextProps,
	OrderData,
	OrderForm,
} from "../types/OrderContext";
import type { BasketElement } from "../types/BasketContext";

const STORAGE_KEY = "order";

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [order, setOrderState] = useState<OrderData | null>(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as OrderData;
				setOrderState(parsed);
			}
		} catch (err) {
			console.warn("Error loading order from localStorage", err);
		}
	}, []);

	useEffect(() => {
		try {
			if (order) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		} catch (err) {
			console.warn("Error saving order to localStorage", err);
		}
	}, [order]);

	const setOrder = (data: OrderData) => setOrderState(data);

	const clearOrder = () => setOrderState(null);

	const initOrderFromBasket = (
		items: BasketElement[],
		form?: Partial<OrderForm>
	): OrderData => {
		return {
			form: {
				email: form?.email ?? "",
				delivery: form?.delivery ?? "ground",
				firstName: form?.firstName ?? "",
				lastName: form?.lastName ?? "",
				phone: form?.phone ?? "",
				address1: form?.address1 ?? "",
				address2: form?.address2 ?? "",
				city: form?.city ?? "",
				state: form?.state ?? "",
				postalCode: form?.postalCode ?? "",
				country: form?.country ?? "",
			},
			basketItems: items,
		};
	};

	return (
		<OrderContext.Provider
			value={{ order, setOrder, clearOrder, initOrderFromBasket }}
		>
			{children}
		</OrderContext.Provider>
	);
};

export const useOrder = () => {
	const ctx = useContext(OrderContext);
	if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
	return ctx;
};
