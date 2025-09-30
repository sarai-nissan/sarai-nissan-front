import React from "react";
import { useProductStore } from "../store/productStore";
import { useFilter } from "../contexts/FilterContext";
import ProductFilter from "../components/productFilter/ProductFilter";
import ProductCard from "../components/productCard/ProductCard";
import "../styles/shopPage.css";

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

	if (isLoading) return <div className="shopTitle">Loading...</div>;
	if (error) return <div className="shopTitle">Error: {error}</div>;

	return (
		<div className="shopContainer">
			<ProductFilter />
			<div className="shopProductList">
				{filteredProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};

export default ShopPage;
