import React from "react";
import { Link } from "react-router-dom";
import type { ProductType } from "../../types/Product";
import "./productCard.css";

const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
	const priceLabel = product.price.includes("from")
		? product.price
		: `$${product.price}`;

	return (
		<Link
			to={`/product/${product.id}`}
			className="productCardContainer"
			state={{ product }}
		>
			<img
				className="productCardImage"
				src={`${product.photo[0]?.url}`}
				alt={product.name}
			/>
			<div className="productCardInfoContainer">
				<p className="productCardText">{product.name}</p>
				<p className="productCardText">{priceLabel}</p>
			</div>
		</Link>
	);
};

export default ProductCard;
