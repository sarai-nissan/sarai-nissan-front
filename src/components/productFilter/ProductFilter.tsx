import { useFilter } from "../../contexts/FilterContext";
import { categories } from "../../constants";
import type { CategoryType } from "../../types/FilterContextTypes";
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
					onClick={() =>
						setSelectedCategory(category.toLowerCase() as CategoryType)
					}
				>
					{category}
				</p>
			))}
		</div>
	);
};

export default ProductFilter;
