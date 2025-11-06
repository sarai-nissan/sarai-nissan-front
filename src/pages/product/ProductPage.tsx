import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import ProductImages from "./components/productImages/ProductImages";
import ProductInfo from "./components/productInfo/ProductInfo";
import { slugify } from "../../utils";
import "./productPage.css";

const ProductPage: React.FC = () => {
	const { slug } = useParams();
	const { products } = useProductStore();
	const product = products.find((p) => slugify(p.name) === slug);

	const [selectedOption, setSelectedOption] = useState<string>("");

	if (!product) {
		return <div className="productPageNotFound">Product not found</div>;
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
