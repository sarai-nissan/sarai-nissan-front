import { Link } from "react-router-dom";
import { slugify } from "../../../../utils";
import type { ProductType } from "../../../../types/Product";
import "./shopProductCard.css";

const ShopProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
	const priceLabel = product.price.includes("from")
		? product.price
		: `$${product.price}`;

	return (
		<Link
			to={`/product/${slugify(product.name)}`}
			className="shopProductCardContainer"
			state={{ product }}
		>
			{product.sold && (
				<div className="shopProductCardSoldContainer">
					<p className="shopProductCardSoldText">SOLD</p>
					<p className="shopProductCardSoldText">OUT</p>
				</div>
			)}

			<img
				className="shopProductCardImage"
				src={`${product.photo[0]?.url}`}
				alt={product.name}
			/>
			<div className="shopProductCardInfoContainer">
				<p className="shopProductCardText">{product.name}</p>
				<p className="shopProductCardText">{priceLabel}</p>
			</div>
		</Link>
	);
};

export default ShopProductCard;
