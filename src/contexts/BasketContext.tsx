import { createContext, useContext, useEffect, useState } from "react";
import type { ProductType } from "../types/Product";
import type { BasketContextType, BasketElement } from "../types/BasketContext";

const BasketContext = createContext<BasketContextType | undefined>(undefined);
const BASKET_STORAGE_KEY = "sarai_basket";
const API_URL = import.meta.env.VITE_STRAPI_API_URL;

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [basket, setBasket] = useState<BasketElement[]>(() => {
		const savedBasket = localStorage.getItem(BASKET_STORAGE_KEY);
		return savedBasket ? JSON.parse(savedBasket) : [];
	});

	useEffect(() => {
		if (basket.length > 0) {
			localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket));
		}
	}, [basket]);

	useEffect(() => {
		const checkProductsUpdates = async () => {
			if (basket.length === 0) return;

			try {
				const updatedBasket = await Promise.all(
					basket.map(async (item) => {
						try {
							const response = await fetch(
								`${API_URL}/api/products/${item.product.documentId}?populate=*`
							);

							if (!response.ok) {
								console.warn("❌ Product not found:", item.product.documentId);
								return item;
							}

							const data = await response.json();

							const latest =
								data?.data?.attributes ||
								(data?.data && typeof data.data === "object"
									? data.data
									: null);

							if (!latest) {
								console.warn(
									"⚠️ No product data for:",
									item.product.documentId
								);
								return item;
							}

							const latestProduct: ProductType = {
								...latest,
								id: data.data.id ?? item.product.id,
								documentId: data.data.documentId ?? item.product.documentId,
								sold: latest.sold ?? data.data.sold ?? false,
							};

							let updatedItem = { ...item, product: latestProduct };

							if (latestProduct.price !== item.product.price) {
								updatedItem.selectedPrice = latestProduct.price;
							}

							updatedItem.product.sold = latestProduct.sold;

							return updatedItem;
						} catch (error) {
							console.warn(
								"⚠️ Failed to fetch product:",
								item.product.documentId,
								error
							);
							return item;
						}
					})
				);

				setBasket(updatedBasket);
				localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(updatedBasket));
			} catch (error) {
				console.error("Failed to sync basket:", error);
			}
		};

		checkProductsUpdates();
	}, [API_URL]);

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
