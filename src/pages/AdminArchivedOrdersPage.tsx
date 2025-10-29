import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminOrderItem from "../components/adminOrderItem/AdminOrderItem";
import type { Order } from "../types/AdminPage";
import "../styles/adminArchivedOrdersPage.css";

const AdminArchivedOrdersPage = () => {
	const location = useLocation();
	const apiUrl = import.meta.env.VITE_STRAPI_API_URL;
	const [orders, setOrders] = useState<Order[]>(location.state?.orders || []);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (orders.length > 0) {
			setLoading(false);
			return;
		}

		const controller = new AbortController();

		const loadOrders = async () => {
			try {
				const res = await fetch(`${apiUrl}/api/orders?populate=*`, {
					signal: controller.signal,
				});
				if (!res.ok) throw new Error("Failed to fetch orders");

				const data = await res.json();
				if (data.data) {
					const sortedOrders = data.data.sort(
						(a: Order, b: Order) =>
							new Date(b.createdAt || "").getTime() -
							new Date(a.createdAt || "").getTime()
					);
					setOrders(sortedOrders);
				}
			} catch (err: any) {
				if (err.name !== "AbortError") {
					console.error(err);
					setError("Error loading orders");
				}
			} finally {
				setLoading(false);
			}
		};

		loadOrders();
		return () => controller.abort();
	}, [apiUrl, orders]);

	if (loading)
		return (
			<div className="adminArchivedContainer">
				<AdminHeader title="Archived Orders" />
				<p className="adminArchivedLightText">Loading...</p>
			</div>
		);

	if (error)
		return (
			<div className="adminArchivedContainer">
				<AdminHeader title="Archived Orders" />
				<p className="adminArchivedLightText">Error: {error}</p>
			</div>
		);

	return (
		<div className="adminArchivedContainer">
			<AdminHeader title="Archived Orders" />

			{orders.length > 0 ? (
				orders.map((order) => <AdminOrderItem key={order.id} order={order} />)
			) : (
				<p className="adminArchivedLightText"> No archived orders</p>
			)}
		</div>
	);
};

export default AdminArchivedOrdersPage;
