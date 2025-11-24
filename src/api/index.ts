import { apiUrl } from "../constants";
import type { ShippingOption } from "../types/useSettingsStoreTypes";

// add contact to omnisend list
export const sendEmail = async (email: string) => {
	try {
		await fetch("https://api.omnisend.com/v3/contacts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-KEY": import.meta.env.VITE_OMNISEND_API_KEY,
			},
			body: JSON.stringify({
				identifiers: [
					{
						type: "email",
						id: email,
						channels: {
							email: {
								status: "subscribed",
							},
						},
					},
				],
			}),
		});
	} catch (error) {
		console.error("Error sending email:", error);
	}
};

export const getAllProducts = async () => {
	try {
		const res = await fetch(`${apiUrl}/api/products?populate=*`);
		if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);

		const data = await res.json();
		if (!data?.data) throw new Error("No product data received");

		return (data.data || []).map((item: any) => ({
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
	} catch (err) {
		console.error("❌ Error loading products:", err);
		throw err;
	}
};

export const getProductById = async (productId: string | number) => {
	try {
		const res = await fetch(`${apiUrl}/api/products/${productId}?populate=*`);
		if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`);

		const data = await res.json();

		const latest =
			data?.data?.attributes ||
			(data?.data && typeof data.data === "object" ? data.data : null);

		if (!latest) throw new Error("No product data received");

		return {
			...latest,
			id: data.data.id ?? latest.id,
			documentId: data.data.documentId ?? latest.documentId,
			sold: latest.sold ?? data.data.sold ?? false,
		};
	} catch (err) {
		console.error("❌ Error fetching product:", err);
		throw err;
	}
};

export const checkProductsUpdates = async () => {
	try {
		const res = await fetch(`${apiUrl}/api/products?populate=*`);
		if (!res.ok)
			throw new Error(`Failed to check product updates (${res.status})`);

		const data = await res.json();
		if (!data?.data) throw new Error("No product data received");

		return (data.data || []).map((item: any) => ({
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
	} catch (err) {
		console.error("❌ Error checking product updates:", err);
		throw err;
	}
};

export const updateProductById = async (id: string | number, data: any) => {
	try {
		const res = await fetch(`${apiUrl}/api/products/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (!res.ok) throw new Error(`Failed to update product (${res.status})`);

		const result = await res.json();
		return result;
	} catch (err) {
		console.error("❌ Error updating product:", err);
		throw err;
	}
};

export const createCheckoutSession = async ({
	basketItems,
	email,
	shippingCost,
	taxAmount,
}: {
	basketItems: {
		name: string;
		price: number;
		quantity: number;
		option?: string;
	}[];
	email?: string;
	shippingCost?: number;
	taxAmount?: number;
}) => {
	try {
		const res = await fetch(`${apiUrl}/api/checkout`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				basketItems,
				email,
				shippingCost,
				taxAmount,
			}),
		});

		if (!res.ok)
			throw new Error(`Failed to create checkout session (${res.status})`);

		const data = await res.json();
		return data;
	} catch (err) {
		console.error("❌ Error creating checkout session:", err);
		throw err;
	}
};

// save order to strapi backend
export const createOrder = async (orderPayload: any) => {
	try {
		const res = await fetch(`${apiUrl}/api/orders`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ data: orderPayload }),
		});

		if (!res.ok) throw new Error(`Failed to create order (${res.status})`);
		const data = await res.json();

		console.log("✅ Order created:", data);

		if (orderPayload.email) {
			await sendEmail(orderPayload.email);
		}

		return data;
	} catch (err) {
		console.error("❌ Error creating order:", err);
		throw err;
	}
};

export const checkAdminPin = async (pin: string) => {
	try {
		const res = await fetch(`${apiUrl}/api/check-pin`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pin }),
		});

		if (!res.ok) throw new Error(`Failed to check PIN (${res.status})`);

		const result = await res.json();
		return result;
	} catch (err) {
		console.error("❌ Error verifying admin PIN:", err);
		throw err;
	}
};

export const getAllOrders = async () => {
	try {
		const res = await fetch(`${apiUrl}/api/orders?populate=*`);
		if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);

		const data = await res.json();
		if (!data?.data) throw new Error("No order data received");

		return data.data.sort(
			(a: any, b: any) =>
				new Date(b.createdAt || "").getTime() -
				new Date(a.createdAt || "").getTime()
		);
	} catch (err) {
		console.error("❌ Error loading all orders:", err);
		throw err;
	}
};

export const getOrderById = async (orderId: string, signal?: AbortSignal) => {
	try {
		const res = await fetch(`${apiUrl}/api/orders/${orderId}?populate=*`, {
			signal,
		});
		if (!res.ok) {
			if (res.status === 404) throw new Error("Order not found");
			throw new Error(`Failed to fetch order (${res.status})`);
		}

		const data = await res.json();
		if (!data?.data) throw new Error("No order data received");
		return data.data;
	} catch (err) {
		console.error("❌ Error loading order:", err);
		throw err;
	}
};

export const setOrderArchived = async (
	id: number | string,
	archived: boolean
) => {
	try {
		const res = await fetch(`${apiUrl}/api/orders/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ data: { archived } }),
		});

		if (!res.ok)
			throw new Error(
				`Failed to ${archived ? "archive" : "unarchive"} order (${res.status})`
			);

		const data = await res.json();
		return data.data;
	} catch (err) {
		console.error(
			`❌ Error ${archived ? "archiving" : "unarchiving"} order:`,
			err
		);
		throw err;
	}
};

export const updateOrderArchived = async (
	orderId: string | number,
	archived: boolean
) => {
	try {
		const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ data: { archived } }),
		});
		if (!res.ok) throw new Error(`Failed to update order (${res.status})`);
		const data = await res.json();
		return data.data;
	} catch (err) {
		console.error("❌ Error updating order archive state:", err);
		throw err;
	}
};

export const getAllEvents = async () => {
	try {
		const res = await fetch(`${apiUrl}/api/events?populate=*`);
		if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);

		const data = await res.json();
		if (!data?.data) throw new Error("No event data received");

		return data.data.sort(
			(a: any, b: any) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		);
	} catch (err) {
		console.error("❌ Error loading events:", err);
		throw err;
	}
};

export const createEvent = async (newEventData: any) => {
	try {
		const res = await fetch(`${apiUrl}/api/events`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data: newEventData }),
		});

		if (!res.ok) throw new Error(`Failed to create event (${res.status})`);

		const data = await res.json();
		return data.data;
	} catch (err) {
		console.error("❌ Error creating event:", err);
		throw err;
	}
};

export const updateEventById = async (documentId: string, updatedData: any) => {
	try {
		const res = await fetch(`${apiUrl}/api/events/${documentId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data: updatedData }),
		});

		if (!res.ok) throw new Error(`Failed to update event (${res.status})`);
		const data = await res.json();
		return data.data;
	} catch (err) {
		console.error("❌ Error updating event:", err);
		throw err;
	}
};

export const deleteEventById = async (documentId: string) => {
	try {
		const res = await fetch(`${apiUrl}/api/events/${documentId}`, {
			method: "DELETE",
		});
		if (!res.ok) throw new Error(`Failed to delete event (${res.status})`);
		return true;
	} catch (err) {
		console.error("❌ Error deleting event:", err);
		throw err;
	}
};

export const getTaxPercent = async () => {
	try {
		const res = await fetch(`${apiUrl}/api/taxes`);
		if (!res.ok) throw new Error("Failed to fetch tax");

		const json = await res.json();

		if (!json.data || json.data.length === 0) return null;

		const item = json.data[0];

		const result = {
			id: item.id,
			documentId: item.documentId,
			taxPercent: Number(item.taxPercent),
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			publishedAt: item.publishedAt,
		};

		return result;
	} catch (err) {
		console.error("❌ getTaxPercent error:", err);
		return null;
	}
};

export const getShippingOptions = async () => {
	try {
		const res = await fetch(`${apiUrl}/api/shipping-options`);
		if (!res.ok)
			throw new Error(`Failed to fetch shipping options (${res.status})`);

		const json = await res.json();

		const result = json.data.map((item: ShippingOption) => ({
			id: item.id,
			documentId: item.documentId,
			uid: item.uid,
			label: item.label,
			price: item.price,
			type: item.type,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			publishedAt: item.publishedAt,
		}));

		return result;
	} catch (err) {
		console.error("❌ Error loading shipping options:", err);
		return [];
	}
};

export const updateShippingOption = async (documentId: string, data: any) => {
	try {
		const url = `${apiUrl}/api/shipping-options/${documentId}`;

		const res = await fetch(url, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ data }),
		});

		if (!res.ok) {
			throw new Error(`Failed to update shipping option (${res.status})`);
		}

		return await res.json();
	} catch (err) {
		console.error("❌ updateShippingOption error:", err);
		throw err;
	}
};

export const updateTaxPercent = async (
	documentId: string,
	data: { taxPercent: number }
) => {
	try {
		const url = `${apiUrl}/api/taxes/${documentId}`;

		const res = await fetch(url, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ data }),
		});

		if (!res.ok) {
			throw new Error(`Failed to update tax (${res.status})`);
		}

		return await res.json();
	} catch (error) {
		console.error("❌ updateTaxPercent error:", error);
		throw error;
	}
};

// export const sendInvoiceEmail = async (
// 	email: string,
// 	invoiceNumber: string
// ) => {
// 	try {
// 		const response = await fetch("https://api.omnisend.com/v3/emails", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 				"X-API-KEY": import.meta.env.VITE_OMNISEND_API_KEY,
// 			},
// 			body: JSON.stringify({
// 				from: {
// 					email: "sarainissanhelp@gmail.com",
// 					name: "Sarai Nissan Shop",
// 				},
// 				to: [{ email }],
// 				subject: "Your order has been shipped!",
// 				htmlContent: `<p>Thank you for your order!</p><p>Your tracking number: <b>${invoiceNumber}</b></p>`,
// 				textContent: `Thank you for your order! Your tracking number: ${invoiceNumber}`,
// 			}),
// 		});

// 		if (!response.ok) {
// 			const errorText = await response.text();
// 			console.error("❌ Omnisend error:", response.status, errorText);
// 			ctx.status = 500;
// 			ctx.body = { error: "Omnisend request failed", details: errorText };
// 			return;
// 		}

// 		console.log("Invoice email sent successfully");
// 	} catch (err) {
// 		console.error("Error sending invoice email:", err);
// 		throw err;
// 	}
// };
