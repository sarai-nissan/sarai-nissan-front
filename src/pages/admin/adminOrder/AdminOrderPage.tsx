import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSettingsStore } from "../../../store/useSettingsStore";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminOrderProduct from "../../../components/adminOrderProduct/AdminOrderProduct";
import AdminLightText from "../components/adminLightText/AdminLightText";
import AdminOrderLineText from "./components/AdminOrderLineText";
import {
	apiUrl,
	internationalDeliveryType,
	usDeliveryType,
} from "../../../constants";
import { getOrderById, updateOrderArchived } from "../../../api";
import type { Order } from "../../../types/AdminPage";
import "./adminOrderPage.css";

const AdminOrderPage = () => {
	const location = useLocation();
	const { orderId } = useParams();

	const { usDelivery, internationalDelivery } = useSettingsStore();

	const fallbackUS = usDelivery.length > 0 ? usDelivery : usDeliveryType;
	const fallbackInternational =
		internationalDelivery.length > 0
			? internationalDelivery
			: internationalDeliveryType;

	const deliveryMethods = [...fallbackUS, ...fallbackInternational];

	const [order, setOrder] = useState<Order | null>(
		location.state?.order ?? null
	);
	const [loading, setLoading] = useState(!location.state?.order);
	const [error, setError] = useState<string | null>(null);

	const handleArchiveToggle = async (archived: boolean) => {
		if (!order) return;

		const orderDocId = order.documentId || order.id;

		try {
			const updated = await updateOrderArchived(
				orderDocId as string | number,
				archived
			);

			setOrder((prev) =>
				prev ? { ...prev, archived: updated.archived } : prev
			);

			window.dispatchEvent(
				new CustomEvent("orderUpdated", {
					detail: { id: orderDocId, archived },
				})
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

				const data = await getOrderById(orderId, controller.signal);
				setOrder(data);
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

	// const [invoiceNumber, setInvoiceNumber] = useState("");
	// const [sending, setSending] = useState(false);

	// const handleSendInvoice = async () => {
	// 	if (!order?.email) {
	// 		alert("Order email not found");
	// 		return;
	// 	}
	// 	if (!invoiceNumber.trim()) {
	// 		alert("Please enter a tracking number");
	// 		return;
	// 	}

	// 	setSending(true);
	// 	try {
	// 		const response = await fetch(`${apiUrl}/api/send-invoice`, {
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json" },
	// 			body: JSON.stringify({
	// 				email: order.email,
	// 				invoiceNumber,
	// 			}),
	// 		});

	// 		if (!response.ok) throw new Error("Failed to send email");

	// 		alert("✅ Email sent successfully!");
	// 		setInvoiceNumber("");
	// 	} catch (err) {
	// 		console.error(err);
	// 		alert("❌ Failed to send email");
	// 	} finally {
	// 		setSending(false);
	// 	}
	// };

	if (loading) {
		return (
			<div className="adminOrderContainer">
				<AdminHeader title="Order Details" />
				<AdminLightText text="Loading..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className="adminOrderContainer">
				<AdminHeader title="Order Details" />
				<AdminLightText text={`Error: ${error}`} />
			</div>
		);
	}

	if (!order) {
		return (
			<div className="adminOrderContainer">
				<AdminHeader title="Order Details" />
				<AdminLightText text="No order details available" />
			</div>
		);
	}

	const deliveryLabel =
		deliveryMethods.find((d) => d.id === order.delivery)?.label ||
		order.delivery;

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
					<AdminOrderLineText label="Delivery type" value={deliveryLabel} />
				</div>

				<p className="adminOrderRegularText adminOrderShippingText">
					Shipping Info:
				</p>

				<AdminOrderLineText label="email" value={order.email} />
				<AdminOrderLineText label="phone" value={order.phone} />
				<AdminOrderLineText
					label="name"
					value={`${order.firstName ?? ""} ${order.lastName ?? ""}`.trim()}
				/>
				<AdminOrderLineText label="address 1" value={order.address1} />
				{order.address2 && (
					<AdminOrderLineText label="address 2" value={order.address2} />
				)}
				<AdminOrderLineText label="city" value={order.city} />
				<AdminOrderLineText label="state" value={order.state} />
				<AdminOrderLineText label="postal code" value={order.postalCode} />
				<AdminOrderLineText label="country" value={order.country} />
			</div>

			{/* <div
				style={{
					marginTop: "40px",
					padding: "16px",
					borderTop: "1px solid #ddd",
					display: "flex",
					alignItems: "center",
					gap: "10px",
				}}
			>
				<input
					type="text"
					placeholder="Введите номер накладной"
					value={invoiceNumber}
					onChange={(e) => setInvoiceNumber(e.target.value)}
					style={{
						flex: "0 0 200px",
						padding: "8px",
						border: "1px solid #ccc",
						borderRadius: "8px",
					}}
				/>
				<button
					onClick={handleSendInvoice}
					disabled={sending}
					style={{
						padding: "8px 16px",
						borderRadius: "8px",
						background: sending ? "#aaa" : "#007bff",
						color: "#fff",
						border: "none",
						cursor: sending ? "default" : "pointer",
					}}
				>
					{sending ? "Отправка..." : "Отправить накладную"}
				</button>
			</div> */}
		</div>
	);
};

export default AdminOrderPage;
