import React from "react";
import { useFilter } from "../../contexts/FilterContext";
import { categories } from "../../data";
import "./productFilter.css";

const ProductFilter: React.FC = () => {
	const { setSelectedCategory } = useFilter();

	return (
		<div className="productFilterContainer">
			{categories.map((category) => (
				<p
					className="productFilterItem"
					key={category}
					onClick={() => setSelectedCategory(category)}
				>
					{category}
				</p>
			))}
		</div>
	);
};

export default ProductFilter;
