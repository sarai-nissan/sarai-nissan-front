import React from "react";
import { useFilter } from "../contexts/FilterContext";
import ProductFilter from "../components/productFilter/ProductFilter";
import ProductCard from "../components/productCard/ProductCard";
import { products } from "../data";
import "../styles/storePage.css";

const StorePage: React.FC = () => {
	const { selectedCategory } = useFilter();

	const filteredProducts =
		selectedCategory === "all"
			? products
			: products.filter((product) =>
					product.category.includes(selectedCategory)
			  );

	return (
		<div className="storeContainer">
			<ProductFilter />
			<div className="productList">
				{filteredProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};

export default StorePage;
