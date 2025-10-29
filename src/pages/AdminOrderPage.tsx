import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminOrderProduct from "../components/adminOrderProduct/AdminOrderProduct";
import { internationalDeliveryType, usDeliveryType } from "../constants";
import type { Order } from "../types/AdminPage";
import "../styles/adminOrderPage.css";

const apiUrl = import.meta.env.VITE_STRAPI_API_URL;

const LineText: React.FC<{ label: string; value?: string }> = ({
	label,
	value = "",
}) => (
	<div className="adminOrderLineTextContainer">
		<p className="adminOrderLightText">{label}:</p>
		<p className="adminOrderRegularText">{value}</p>
	</div>
);

const AdminOrderPage = () => {
	const location = useLocation();
	const { orderId } = useParams();
	const deliveryMethods = [...usDeliveryType, ...internationalDeliveryType];
	const [order, setOrder] = useState<Order | null>(
		location.state?.order ?? null
	);
	const [loading, setLoading] = useState(!location.state?.order);
	const [error, setError] = useState<string | null>(null);

	const handleArchiveToggle = async (archived: boolean) => {
		if (!order) return;

		const orderDocId = order.documentId || order.id;

		try {
			const response = await fetch(`${apiUrl}/api/orders/${orderDocId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ data: { archived } }),
			});

			if (!response.ok) throw new Error("Failed to update order");

			const updatedOrder = await response.json();

			setOrder((prev) =>
				prev ? { ...prev, archived: updatedOrder.data.archived } : prev
			);

			alert(
				archived
					? "✅ Order moved to archive"
					: "♻️ Order returned to active list"
			);
		} catch (err) {
			console.error("Error while updating archive status:", err);
			alert("Failed to update order");
		}
	};

	useEffect(() => {
		if (order) return;

		if (!orderId) {
			setError("Order ID is missing in the URL");
			setLoading(false);
			return;
		}

		const controller = new AbortController();

		const loadOrder = async () => {
			try {
				setLoading(true);
				setError(null);

				const res = await fetch(`${apiUrl}/api/orders/${orderId}?populate=*`, {
					signal: controller.signal,
				});

				if (!res.ok) {
					if (res.status === 404) throw new Error("Order not found");
					throw new Error(`Failed to fetch order (${res.status})`);
				}

				const data = await res.json();
				if (!data?.data) throw new Error("No order data received");

				setOrder(data.data);
			} catch (err: any) {
				if (err.name === "AbortError") return;
				console.error("❌ Fetch error:", err);
				setError(err.message || "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		loadOrder();
		return () => controller.abort();
	}, [apiUrl, orderId]);

	if (loading) {
		return (
			<div className="adminOrderContainer">
				<AdminHeader title="Order Details" />
				<p className="adminOrderLightText">Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="adminOrderContainer">
				<AdminHeader title="Order Details" />
				<p className="adminOrderLightText">Error: {error}</p>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="adminOrderContainer">
				<AdminHeader title="Order Details" />
				<p className="adminOrderLightText">No order details available</p>
			</div>
		);
	}

	return (
		<div className="adminOrderContainer">
			<AdminHeader
				title="Order Details"
				menuItems={[
					{
						label: "Copy Email",
						action: () => navigator.clipboard.writeText(order.email),
					},
					{
						label: "Copy Phone",
						action: () => navigator.clipboard.writeText(order.phone),
					},
					{
						label: order.archived ? "Return to Orders" : "Move to Archive",
						action: () => handleArchiveToggle(!order.archived),
					},
				]}
			/>

			<div className="adminOrderContent">
				{order.basket?.map((item, index) => (
					<AdminOrderProduct key={item.id + index} item={item} />
				))}

				<div className="adminOrderMargins">
					<LineText
						label="Delivery type"
						value={
							deliveryMethods.find((d) => d.id === order.delivery)?.label ||
							order.delivery
						}
					/>
				</div>

				<p className="adminOrderRegularText adminOrderShippingText">
					Shipping Info:
				</p>

				<LineText label="email" value={order.email} />
				<LineText label="phone" value={order.phone} />
				<LineText
					label="name"
					value={`${order.firstName ?? ""} ${order.lastName ?? ""}`.trim()}
				/>
				<LineText label="address 1" value={order.address1} />
				{order.address2 && (
					<LineText label="address 2" value={order.address2} />
				)}
				<LineText label="city" value={order.city} />
				<LineText label="state" value={order.state} />
				<LineText label="postal code" value={order.postalCode} />
				<LineText label="country" value={order.country} />
			</div>
		</div>
	);
};

export default AdminOrderPage;
