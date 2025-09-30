import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import ProductImages from "../components/productImages/ProductImages";
import ProductInfo from "../components/productInfo/ProductInfo";
import "../styles/productPage.css";

const ProductPage: React.FC = () => {
	const { id } = useParams();
	const { products } = useProductStore();
	const product = products.find((p) => String(p.id) === id);

	const [selectedOption, setSelectedOption] = useState<string>("");

	if (!product) {
		return <h2 className="productPageNotFound">Product not found</h2>;
	}

	return (
		<div className="productPageContainer">
			<ProductImages images={product.photo} selectedOption={selectedOption} />
			<ProductInfo
				product={product}
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>
		</div>
	);
};

export default ProductPage;
