import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductStoreType } from "../types/ProductStore";
import type { ProductType } from "../types/Product";

export const useProductStore = create<ProductStoreType>()(
	persist(
		(set, get) => ({
			products: [],
			isLoading: false,
			error: null,

			fetchProducts: async (force = false) => {
				const { products } = get();

				if (!force && products.length > 0) {
					console.log("✅ Using cached products");
					return;
				}

				set({ isLoading: true, error: null });

				try {
					const res = await fetch(
						`${import.meta.env.VITE_STRAPI_API_URL}/api/products?populate=*`
					);
					if (!res.ok) throw new Error("Error fetching products");

					const data = await res.json();

					const formatted = (data.data || []).map((item: any) => ({
						id: item.id ?? item.data?.id,
						documentId: item.documentId ?? item.data?.documentId,
						...(item.attributes || item),
						sold: item.attributes?.sold ?? item.sold ?? false,
						price: item.attributes?.price ?? item.price ?? "",
						updatedAt:
							item.attributes?.updatedAt ??
							item.updatedAt ??
							new Date().toISOString(),
					}));

					set({ products: formatted, isLoading: false });
				} catch (err) {
					console.error("❌ Fetch error:", err);
					set({ isLoading: false, error: "Failed to fetch products" });
				}
			},

			checkProductUpdates: async () => {
				const { products } = get();
				if (products.length === 0) return;

				console.log("🔍 Checking for product updates...");

				try {
					const res = await fetch(
						`${import.meta.env.VITE_STRAPI_API_URL}/api/products?populate=*`
					);
					if (!res.ok) throw new Error("Error checking products");

					const data = await res.json();

					const latestProducts = (data.data || []).map((item: any) => ({
						id: item.id ?? item.data?.id,
						documentId: item.documentId ?? item.data?.documentId,
						...(item.attributes || item),
						sold: item.attributes?.sold ?? item.sold ?? false,
						price: item.attributes?.price ?? item.price ?? "",
						updatedAt:
							item.attributes?.updatedAt ??
							item.updatedAt ??
							new Date().toISOString(),
					}));

					const merged = products.map((cached) => {
						const latest = latestProducts.find(
							(p: ProductType) => p.documentId === cached.documentId
						);

						if (!latest) return cached;

						const cachedTime = new Date(cached.updatedAt).getTime();
						const latestTime = new Date(latest.updatedAt).getTime();

						if (latestTime > cachedTime) {
							return { ...cached, ...latest };
						}
						return cached;
					});

					set({ products: merged });
				} catch (err) {
					console.error("❌ Failed to check product updates:", err);
				}
			},

			clearProducts: () => set({ products: [] }),
		}),
		{
			name: "product-cache",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
