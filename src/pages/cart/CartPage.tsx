import { useNavigate } from "react-router-dom";
import { useBasket } from "../../contexts/BasketContext";
import BasketItem from "./components/basketItem/BasketItem";
import Button from "../../components/button/Button";
import "./cartPage.css";

const CartPage: React.FC = () => {
	const { basket } = useBasket();
	const navigation = useNavigate();
	const soldItems = basket.filter((item) => item.product.sold);

	const subtotalAmount = basket.reduce((acc, item) => {
		const itemPrice = Number(item.selectedPrice.replace("$", ""));
		return acc + itemPrice * item.quantity;
	}, 0);

	if (basket.length === 0) {
		return (
			<div className="cartPageContainer">
				<p className="cartPageEmptyText">Your cart is empty</p>
			</div>
		);
	}

	return (
		<div className="cartPageContainer">
			{basket.map((item) => (
				<BasketItem key={item.id} product={item} />
			))}
			<div className="cartPageTotalContainer">
				<div className="cartPageTotalInnerContainer">
					<p className="cartPageTotalText">Subtotal: </p>
					<p className="cartPageTotalText">${subtotalAmount.toFixed(2)}</p>
				</div>
				<Button
					text="Checkout"
					onClick={() => navigation("/checkout")}
					disabled={soldItems.length > 0}
					buttonClassName="cartPageCheckoutButton"
				/>
			</div>
		</div>
	);
};

export default CartPage;
