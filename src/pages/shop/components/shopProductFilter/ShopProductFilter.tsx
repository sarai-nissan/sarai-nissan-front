import { useFilter } from "../../../../contexts/FilterContext";
import { categories } from "../../../../constants";
import type { CategoryType } from "../../../../types/FilterContextTypes";
import "./shopProductFilter.css";

const ShopProductFilter: React.FC = () => {
	const { selectedCategory, setSelectedCategory } = useFilter();

	return (
		<div className="shopProductFilterContainer">
			{categories.map((category) => (
				<p
					className={`${
						selectedCategory === category.toLowerCase()
							? "shopProductFilterItem active"
							: "shopProductFilterItem"
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

export default ShopProductFilter;
