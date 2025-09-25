import React from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import ProductImages from "../components/productImages/ProductImages";
import ProductInfo from "../components/productInfo/ProductInfo";
import "../styles/productPage.css";

const ProductPage: React.FC = () => {
	const { id } = useParams();
	const { products } = useProductStore();
	const product = products.find((p) => String(p.id) === id);

	if (!product) {
		return <h2 className="productPageNotFound">Product not found</h2>;
	}

	return (
		<div className="productPageContainer">
			<ProductImages images={product.photo} />
			<ProductInfo product={product} />
		</div>
	);
};

export default ProductPage;
