import { useOrders } from "../contexts/OrdersContext";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminOrderItem from "../components/adminOrderItem/AdminOrderItem";
import "../styles/adminArchivedOrdersPage.css";

const AdminArchivedOrdersPage = () => {
	const { orders, loading, error } = useOrders();
	const archivedOrders = orders.filter((order) => order.archived);

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
			{archivedOrders.length > 0 ? (
				archivedOrders.map((order) => (
					<AdminOrderItem key={order.id} order={order} />
				))
			) : (
				<p className="adminArchivedLightText">No archived orders</p>
			)}
		</div>
	);
};

export default AdminArchivedOrdersPage;
