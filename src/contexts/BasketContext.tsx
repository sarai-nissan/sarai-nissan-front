import { createContext, useContext, useEffect, useState } from "react";
import type { ProductType } from "../types/Product";
import type { BasketContextType, BasketElement } from "../types/BasketContext";

const BasketContext = createContext<BasketContextType | undefined>(undefined);
const BASKET_STORAGE_KEY = "sarai_basket";

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [basket, setBasket] = useState<BasketElement[]>(() => {
		const savedBasket = localStorage.getItem(BASKET_STORAGE_KEY);
		return savedBasket ? JSON.parse(savedBasket) : [];
	});

	useEffect(() => {
		localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket));
	}, [basket]);

	const addToBasket = (
		product: ProductType,
		quantity: number = 1,
		selectedPrice: string,
		selectedOption: string = ""
	) => {
		const itemKey = `${product.id}-${selectedOption}`;

		setBasket((prev) => {
			const existingItem = prev.find((item) => item.id === itemKey);

			if (existingItem) {
				return prev.map((item) =>
					item.id === itemKey
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			}

			return [
				...prev,
				{
					id: itemKey,
					quantity,
					selectedPrice,
					product,
					selectedOption,
				},
			];
		});
	};

	const removeFromBasket = (id: string | number) => {
		setBasket((prev) => prev.filter((item) => item.id !== id));
	};

	const updateQuantity = (id: string | number, quantity: number) => {
		if (quantity < 1) {
			removeFromBasket(id);
			return;
		}
		setBasket((prev) =>
			prev.map((item) => (item.id === id ? { ...item, quantity } : item))
		);
	};

	const clearBasket = () => {
		setBasket([]);
	};

	return (
		<BasketContext.Provider
			value={{
				basket,
				addToBasket,
				removeFromBasket,
				updateQuantity,
				clearBasket,
			}}
		>
			{children}
		</BasketContext.Provider>
	);
};

export const useBasket = () => {
	const context = useContext(BasketContext);
	if (!context) {
		throw new Error("useBasket must be used within a BasketProvider");
	}
	return context;
};
