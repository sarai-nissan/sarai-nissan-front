import { useEffect, useState } from "react";
import { useBasket } from "../../../../contexts/BasketContext";
import Button from "../../../../components/button/Button";
import type { ProductDropdown, ProductType } from "../../../../types/Product";
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

	const { addToBasket } = useBasket();
	const [buttonText, setButtonText] = useState("Add to Cart");
	const [quantity, setQuantity] = useState(1);
	const priceLabel = price.includes("from") ? price : `$${price}`;
	const [selectedPrice, setSelectedPrice] = useState(priceLabel);
	const disabledButton = sold || (dropdown && selectedOption === "");

	const incrementHandler = () => setQuantity(quantity + 1);
	const decrementHandler = () => {
		if (quantity > 1) setQuantity(quantity - 1);
	};
	const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setSelectedOption(value);
		const selectedObj =
			dropdown && dropdown.find((opt: ProductDropdown) => opt.label === value);
		if (selectedObj?.price) {
			setSelectedPrice(`$${selectedObj.price}`);
		} else {
			setSelectedPrice(priceLabel);
		}
	};
	const handleAddToBasket = () => {
		addToBasket(product, quantity, selectedPrice, selectedOption);
		setButtonText("Added!");
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setButtonText("Add to Cart");
		}, 2000);
		return () => clearTimeout(timer);
	}, [handleAddToBasket]);

	return (
		<div className="productInfoContainer">
			<p className="productInfoName">{name}</p>

			<div className="productInfoPriceContainer">
				<p className="productInfoPrice">{selectedPrice}</p>
				{sold && <p className="productInfoSoldOut">Sold Out</p>}
			</div>

			{dropdown && (
				<div className="productInfoDropdownContainer">
					<p className="productInfoQuantity">{dropdownTitle}:</p>
					<select
						className="productInfoDropdown"
						value={selectedOption}
						onChange={(e) => selectHandler(e)}
					>
						<option value="" disabled>
							Select an option
						</option>
						{dropdown.map((option: ProductDropdown, index: number) => (
							<option value={option.label} key={index}>
								{option.label}
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

			<div className="productInfoAddToCartButtonContainer">
				<Button
					text={buttonText}
					onClick={handleAddToBasket}
					disabled={disabledButton}
					buttonClassName="productInfoAddToCartButton"
				/>
			</div>

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
