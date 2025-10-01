import React from "react";
import { useBasket } from "../contexts/BasketContext";
import BasketItem from "../components/basketItem/BasketItem";
import "../styles/cartPage.css";

const CartPage: React.FC = () => {
	const { basket } = useBasket();

	const totalAmount = basket.reduce((acc, item) => {
		const itemPrice = Number(item.selectedPrice.replace("$", ""));
		return acc + itemPrice * item.quantity;
	}, 0);

	return (
		<div className="cartPageContainer">
			{basket.map((item) => (
				<BasketItem key={item.id} product={item} />
			))}
			<div className="cartPageTotalContainer">
				<div className="cartPageTotalInnerContainer">
					<p className="cartPageTotalText">Subtotal: </p>
					<p className="cartPageTotalText"> $ {totalAmount.toFixed(2)}</p>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
