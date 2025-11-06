import { useOrders } from "../../../contexts/OrdersContext";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminLightText from "../components/adminLightText/AdminLightText";
import AdminOrderItem from "../components/adminOrderItem/AdminOrderItem";
import "./adminArchivedOrdersPage.css";

const AdminArchivedOrdersPage = () => {
	const { orders, loading, error } = useOrders();
	const archivedOrders = orders.filter((order) => order.archived);

	if (loading)
		return (
			<div className="adminArchivedContainer">
				<AdminHeader title="Archived Orders" />
				<AdminLightText
					text="Loading..."
					textClassName="adminArchivedLightText"
				/>
			</div>
		);

	if (error)
		return (
			<div className="adminArchivedContainer">
				<AdminHeader title="Archived Orders" />
				<AdminLightText
					text={`Error: ${error}`}
					textClassName="adminArchivedLightText"
				/>
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
				<AdminLightText
					text="No archived orders"
					textClassName="adminArchivedLightText"
				/>
			)}
		</div>
	);
};

export default AdminArchivedOrdersPage;
