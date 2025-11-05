import { useOrders } from "../contexts/OrdersContext";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminOrderItem from "../components/adminOrderItem/AdminOrderItem";
import "../styles/adminOrdersPage.css";

const AdminOrdersPage = () => {
	const { orders, loading, error } = useOrders();
	const activeOrders = orders.filter((order) => !order.archived);

	if (loading)
		return (
			<div className="adminOrdersContainer">
				<AdminHeader title="Orders" />
				<p className="adminOrdersLightText">Loading...</p>
			</div>
		);

	if (error)
		return (
			<div className="adminOrdersContainer">
				<AdminHeader title="Orders" />
				<p className="adminOrdersLightText">Error: {error}</p>
			</div>
		);

	return (
		<div className="adminOrdersContainer">
			<AdminHeader title="Orders" />
			{activeOrders.length > 0 ? (
				activeOrders.map((order) => (
					<AdminOrderItem key={order.id} order={order} />
				))
			) : (
				<p className="adminOrdersLightText">No new orders</p>
			)}
		</div>
	);
};

export default AdminOrdersPage;
