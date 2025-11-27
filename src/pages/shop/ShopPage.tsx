import { useFilter } from "../../contexts/FilterContext";
import { useProductStore } from "../../store/productStore";
import ShopProductFilter from "./components/shopProductFilter/ShopProductFilter";
import ShopProductCard from "./components/shopProductCard/ShopProductCard";
import "./shopPage.css";

const ShopPage: React.FC = () => {
	const { selectedCategory } = useFilter();
	const { products, isLoading, error } = useProductStore();

	const filteredProducts =
		selectedCategory.toLowerCase() === "all"
			? products
			: products.filter((product) =>
					product.category.some(
						(cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
					)
			  );

	if (!products) return <div className="shopPageTitle">No products</div>;

	if (isLoading) return <div className="shopPageTitle">Loading...</div>;
	if (error) return <div className="shopPageTitle">Error: {error}</div>;

	return (
		<div className="shopPageContainer">
			<ShopProductFilter />
			<div className="shopPageProductList">
				{filteredProducts.map((product) => (
					<ShopProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};

export default ShopPage;
