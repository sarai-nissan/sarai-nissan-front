import { useOrders } from "../../../contexts/OrdersContext";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminLightText from "../components/adminLightText/AdminLightText";
import AdminOrderItem from "../components/adminOrderItem/AdminOrderItem";
import "./adminActualOrdersPage.css";

const AdminActualOrdersPage = () => {
	const { orders, loading, error } = useOrders();
	const activeOrders = orders.filter((order) => !order.archived);

	if (loading)
		return (
			<div className="adminActualOrdersPageContainer">
				<AdminHeader title="Orders" />
				<AdminLightText
					text="Loading..."
					textClassName="adminActualOrdersPageLightText"
				/>
			</div>
		);

	if (error)
		return (
			<div className="adminActualOrdersPageContainer">
				<AdminHeader title="Orders" />
				<AdminLightText
					text={`Error: ${error}`}
					textClassName="adminActualOrdersPageLightText"
				/>
			</div>
		);

	return (
		<div className="adminActualOrdersPageContainer">
			<AdminHeader title="Orders" />
			{activeOrders.length > 0 ? (
				activeOrders.map((order) => (
					<AdminOrderItem key={order.id} order={order} />
				))
			) : (
				<AdminLightText
					text="No new orders"
					textClassName="adminActualOrdersPageLightText"
				/>
			)}
		</div>
	);
};

export default AdminActualOrdersPage;
