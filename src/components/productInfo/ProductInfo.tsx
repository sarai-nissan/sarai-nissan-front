import React, { useState } from "react";
import type { ProductCardProps } from "../../types/Product";
import "./productInfo.css";

type Props = { product: ProductCardProps };

const ProductInfo: React.FC<Props> = (props: Props) => {
	const [quantity, setQuantity] = useState(1);

	const incrementHandler = () => setQuantity(quantity + 1);

	const decrementHandler = () => {
		if (quantity > 1) setQuantity(quantity - 1);
	};

	return (
		<div className="productInfoContainer">
			<p className="productInfoName">{props.product.name}</p>
			<p className="productInfoPrice">${props.product.price}</p>
			<div className="productInfoQuantityContainer">
				<p className="productInfoQuantity">Quantity:</p>
				<p className="productInfoQuantityButton" onClick={decrementHandler}>
					-
				</p>
				<input
					className="productInfoQuantityNumber"
					type="text"
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
				/>
				<p className="productInfoQuantityButton" onClick={incrementHandler}>
					+
				</p>
			</div>
			<button className="productInfoAddToCartButton">Add to Cart</button>
			{props.product.description && (
				<p className="productInfoDescription">{props.product.description}</p>
			)}
			{props.product.size && (
				<p className="productInfoTextReg">{props.product.size}</p>
			)}
			{props.product.facts && (
				<ul className="productInfoTextReg">
					{props.product.facts.map((fact, index) => (
						<li className="productInfoFact" key={index}>
							{fact}
						</li>
					))}
				</ul>
			)}
			{props.product.note && (
				<p className="productInfoTextReg">{props.product.note}</p>
			)}
			{props.product.note2 && (
				<p className="productInfoTextReg">{props.product.note2}</p>
			)}
			{props.product.info && (
				<p className="productInfoTextMed">{props.product.info}</p>
			)}
		</div>
	);
};

export default ProductInfo;
