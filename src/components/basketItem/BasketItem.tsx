import { useBasket } from "../../contexts/BasketContext";
import Cross from "../../assets/icons/Cross";
import type { BasketElement } from "../../types/BasketContext";
import "./basketItem.css";

type Props = {
	product: BasketElement;
};

const BasketItem: React.FC<Props> = ({ product }) => {
	const { removeFromBasket, updateQuantity } = useBasket();
	const isSold = product.product.sold;
	const totalPrice =
		Number(product.selectedPrice.replace("$", "")) * product.quantity;

	const increaseHandler = () => {
		if (isSold) return;
		updateQuantity(product.id, product.quantity + 1);
	};
	const decreaseHandler = () => {
		if (isSold) return;
		if (product.quantity > 1) {
			updateQuantity(product.id, product.quantity - 1);
		}
	};
	const removeHandler = () => removeFromBasket(product.id);

	return (
		<div key={product.id} className="basketItemContainer">
			<img
				src={product.product.photo[0].url}
				alt={product.product.name}
				className="basketItemImage"
			/>

			<div className="basketItemContentContainer">
				<div className="basketItemNameContainer">
					<p className="basketItemText">
						{product.product.name}
						{product.selectedOption && ` - ${product.selectedOption}`}
					</p>
				</div>

				<div className="basketItemControlsContainer">
					<div className="basketItemQuantityContainer">
						<p className="basketItemQuantityButton" onClick={decreaseHandler}>
							-
						</p>
						<p className="basketItemText">{product.quantity}</p>
						<p className="basketItemQuantityButton" onClick={increaseHandler}>
							+
						</p>
					</div>

					<div className="basketItemPriceContainer">
						<div className="basketItemPriceBlock">
							{isSold && <p className="soldOutLabel">Sold Out</p>}
							<p className={`basketItemText ${isSold ? "soldOutPrice" : ""}`}>
								Price: ${totalPrice}
							</p>
						</div>

						<button onClick={removeHandler} className="basketItemRemoveButton">
							<Cross />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BasketItem;
