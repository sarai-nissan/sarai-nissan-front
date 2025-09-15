import React from "react";
import { useParams } from "react-router-dom";
import ProductImages from "../components/productImages/ProductImages";
import ProductInfo from "../components/productInfo/ProductInfo";
import "../styles/productPage.css";
import { test } from "../data";

const ProductPage: React.FC = () => {
	const { id } = useParams();
	const product = test.find((p) => String(p.id) === id);

	if (!product) {
		return <h2 className="productPageNotFound">Product not found</h2>;
	}

	return (
		<div className="productPageContainer">
			<ProductImages images={product.imageUrl} />
			<ProductInfo product={product} />
		</div>
	);
};

export default ProductPage;
