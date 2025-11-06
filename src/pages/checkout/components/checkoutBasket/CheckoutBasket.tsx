import { useBasket } from "../../../../contexts/BasketContext";
import "./checkoutBasket.css";

const CheckoutBasket: React.FC = () => {
	const { basket } = useBasket();

	return (
		<div className="checkoutItemContainer">
			{basket.map((item) => (
				<div key={item.id} className="checkoutItemInnerContainer">
					<img
						src={item.product.photo[0].url}
						alt={item.product.name}
						className="checkoutItemImage"
					/>
					<div className="checkoutItemTextContainer">
						<div className="checkoutItemText">
							{item.product.name}{" "}
							{item.selectedOption && `- ${item.selectedOption}`}
						</div>
						<div className="checkoutItemText">
							{item.selectedPrice} x {item.quantity}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default CheckoutBasket;
