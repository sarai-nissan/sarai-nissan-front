import React, { useState } from "react";
import type { ProductType } from "../../types/Product";
import "./productInfo.css";

type Props = {
	product: ProductType;
	selectedOption: string;
	setSelectedOption: (option: string) => void;
};

const ProductInfo: React.FC<Props> = ({
	product,
	selectedOption,
	setSelectedOption,
}) => {
	const {
		name,
		price,
		description,
		dropdownTitle,
		dropdown,
		size,
		enumeration,
		note1,
		note2,
		warning,
		sold,
	} = product;

	const [quantity, setQuantity] = useState(1);
	const disabledButton = sold || (dropdown && selectedOption === "");

	const incrementHandler = () => setQuantity(quantity + 1);
	const decrementHandler = () => {
		if (quantity > 1) setQuantity(quantity - 1);
	};

	return (
		<div className="productInfoContainer">
			<p className="productInfoName">{name}</p>

			<div className="productInfoPriceContainer">
				<p className="productInfoPrice">${price}</p>
				{sold && <p className="productInfoSoldOut">Sold Out</p>}
			</div>

			{dropdown && (
				<div className="productInfoDropdownContainer">
					<p className="productInfoQuantity">{dropdownTitle}:</p>
					<select
						className="productInfoDropdown"
						value={selectedOption}
						onChange={(e) => setSelectedOption(e.target.value)}
					>
						<option value="" disabled>
							Select an option
						</option>
						{dropdown.map((option, index) => (
							<option value={option} key={index}>
								{option}
							</option>
						))}
					</select>
				</div>
			)}

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

			<button className="productInfoAddToCartButton" disabled={disabledButton}>
				Add to Cart
			</button>

			{description && <p className="productInfoDescription">{description}</p>}

			{size && <p className="productInfoTextReg">{size}</p>}

			{enumeration && (
				<ul className="productInfoTextReg">
					{enumeration.map((fact, index) => (
						<li className="productInfoFact" key={index}>
							{fact}
						</li>
					))}
				</ul>
			)}

			{note1 && <p className="productInfoTextReg">{note1}</p>}

			{note2 && <p className="productInfoTextReg">{note2}</p>}

			{warning && <p className="productInfoTextMed">{warning}</p>}
		</div>
	);
};

export default ProductInfo;
