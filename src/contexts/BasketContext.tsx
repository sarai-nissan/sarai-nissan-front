import { createContext, useContext, useEffect, useState } from "react";
import type { ProductType } from "../types/Product";
import { getProductById } from "../api";
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
		const timeout = setTimeout(() => {
			localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket));
		}, 1000);
		return () => clearTimeout(timeout);
	}, [basket]);

	useEffect(() => {
		const sync = async () => {
			if (basket.length === 0) return;

			try {
				const updated = await Promise.all(
					basket.map(async (item) => {
						try {
							const latest = await getProductById(item.product.documentId);

							const updatedItem = {
								...item,
								product: { ...latest },
							};

							if (latest.price !== item.product.price) {
								updatedItem.selectedPrice = latest.price;
							}

							return updatedItem;
						} catch (err) {
							console.warn("Failed to update", item.product.documentId, err);
							return item;
						}
					})
				);

				setBasket(updated);
			} catch (err) {
				console.error("Failed to sync basket:", err);
			}
		};

		sync();
	}, []);

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

	const clearBasket = () => setBasket([]);

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
