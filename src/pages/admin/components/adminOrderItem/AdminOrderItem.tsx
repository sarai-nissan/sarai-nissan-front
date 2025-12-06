import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../../../store/useProductStore";
import { formatDate } from "../../../../utils";
import type { Order } from "../../../../types/AdminPage";
import "./adminOrderItem.css";

type Props = {
	order: Order;
};

const AdminOrderItem: React.FC<Props> = ({ order }) => {
	const { products } = useProductStore();
	const navigate = useNavigate();

	const getProductImage = (productFromOrder: any): string => {
		if (!productFromOrder?.documentId) return "/images/placeholder.webp";

		const found = products.find(
			(p) => p.documentId === productFromOrder.documentId
		);

		if (found?.photo?.[0]?.url) {
			return found.photo[0].url;
		}

		return "/images/placeholder.webp";
	};

	const navigationHandler = () =>
		navigate(`/admin/orders/${order.documentId}`, { state: { order } });

	return (
		<div className="adminOrderItemContainer" onClick={navigationHandler}>
			<div className="adminOrderItemHorizontalContainer">
				<p className="adminOrderItemIdText">#{order.id}</p>

				<p className="adminOrderItemNameText">
					{order.firstName} {order.lastName}
				</p>
			</div>

			<div className="adminOrderItemHorizontalContainer">
				<p className="adminOrderItemDateText">
					{/* @ts-ignore */}
					{formatDate(order.createdAt as string, "monthName")?.slice(0, 3)}{" "}
					{formatDate(order.createdAt as string, "day")} –{" "}
					{order.basket.reduce((acc, item) => acc + item.quantity, 0)} items
				</p>

				<p className="adminOrderItemCityText">{order.city}</p>
			</div>

			<div className="adminOrderItemHorizontalContainer adminOrderItemGap">
				<div className="adminOrderItemProductImagesContainer">
					{order.basket.map((item) => (
						<img
							key={item.id}
							src={getProductImage(item.product)}
							alt={item.product.name}
							className="adminOrderItemProductImage"
						/>
					))}
				</div>

				<p className="adminOrderItemTotalText">
					$
					{order.basket
						.map((item) => {
							const price = Number(item.selectedPrice.replace("$", ""));
							return price * item.quantity;
						})
						.reduce((sum, subtotal) => sum + subtotal, 0)
						.toFixed(2)}
				</p>
			</div>
		</div>
	);
};

export default AdminOrderItem;
