import React from "react";
import "./productCard.css";

interface ProductCardProps {
	product: {
		id: number;
		name: string;
		price: number;
		imageUrl: string;
	};
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	return (
		<div className="productCardContainer">
			<img className="productCardImage" src={product.imageUrl} alt="Product" />
			<p className="productCardText">{product.name}</p>
			<p className="productCardText">${product.price}</p>
		</div>
	);
};

export default ProductCard;
