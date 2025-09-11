import React from "react";
import { useFilter } from "../contexts/FilterContext";
import ProductFilter from "../components/productFilter/ProductFilter";
import ProductCard from "../components/productCard/ProductCard";
import { products } from "../data";
import "../styles/shopPage.css";

const ShopPage: React.FC = () => {
	const { selectedCategory } = useFilter();

	const filteredProducts =
		selectedCategory === "all"
			? products
			: products.filter((product) =>
					product.category.includes(selectedCategory)
			  );

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
