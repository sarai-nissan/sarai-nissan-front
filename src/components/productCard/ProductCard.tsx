import React from "react";
import { Link } from "react-router-dom";
import type { ProductCardProps } from "../../types/Product";
import "./productCard.css";

const ProductCard: React.FC<{ product: ProductCardProps }> = ({ product }) => {
	return (
		<Link
			to={`/product/${product.id}`}
			className="productCardContainer"
			state={{ product }}
		>
			<img
				className="productCardImage"
				src={product.imageUrl[0]}
				alt="Product"
			/>
			<div className="productCardInfoContainer">
				<p className="productCardText">{product.name}</p>
				<p className="productCardText">${product.price}</p>
			</div>
		</Link>
	);
};

export default ProductCard;
