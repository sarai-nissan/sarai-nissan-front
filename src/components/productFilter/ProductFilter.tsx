import React from "react";
import { useFilter } from "../../contexts/FilterContext";
import { categories } from "../../data";
import "./productFilter.css";

const ProductFilter: React.FC = () => {
	const { selectedCategory, setSelectedCategory } = useFilter();

	return (
		<div className="productFilterContainer">
			{categories.map((category) => (
				<p
					className={`${
						selectedCategory === category.toLowerCase()
							? "productFilterItem active"
							: "productFilterItem"
					}`}
					key={category}
					onClick={() => setSelectedCategory(category.toLowerCase())}
				>
					{category}
				</p>
			))}
		</div>
	);
};

export default ProductFilter;
