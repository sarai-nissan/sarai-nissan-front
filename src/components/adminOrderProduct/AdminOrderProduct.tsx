import type { BasketElement } from "../../types/BasketContext";
import "./adminOrderProduct.css";

type Props = {
	item: BasketElement;
};

const AdminOrderProduct: React.FC<Props> = ({ item }) => {
	const getProductImage = (product: any): string => {
		if (!product?.photo) return "/images/placeholder.webp";
		if (Array.isArray(product.photo)) {
			return product.photo[0]?.url || "/images/placeholder.webp";
		}
		return product.photo;
	};

	return (
		<div className="adminOrderProductContainer">
			<img
				src={getProductImage(item.product)}
				alt={item.product.name}
				className="adminOrderProductImage"
			/>
			<div className="adminOrderProductInfoContainer">
				<div className="adminOrderProductInfoDetails">
					<p className="adminOrderProductRegularText">{item.product.name}</p>
					<p className="adminOrderProductLightText">
						{item.selectedOption && item.selectedOption}
					</p>
				</div>
				<div className="adminOrderProductInfoPrice">
					<p className="adminOrderProductRegularText adminOrderProductEndText">
						{item.quantity} pcs
					</p>
					<p className="adminOrderProductLightText adminOrderProductEndText">
						{item.selectedPrice}
					</p>
				</div>
			</div>
		</div>
	);
};

export default AdminOrderProduct;
