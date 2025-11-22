import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminLightText from "../components/adminLightText/AdminLightText";
import AdminLink from "../components/adminLink/AdminLink";
import { getAllProducts } from "../../../api";
import type { ProductType } from "../../../types/Product";
import "./adminProductsPage.css";

const AdminProductsPage = () => {
	const [products, setProducts] = useState<ProductType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true);
				setError(null);

				const data = await getAllProducts();

				if (!Array.isArray(data)) {
					throw new Error("Invalid products data format");
				}

				setProducts(data);
			} catch (err: any) {
				if (err.name === "AbortError") return;
				console.error("❌ Load products error:", err);
				setError(err.message || "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		loadProducts();
	}, []);

	if (loading) {
		return (
			<div className="adminProductContainer">
				<AdminHeader title="Products" />
				<AdminLightText text="Loading..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className="adminProductContainer">
				<AdminHeader title="Products" />
				<AdminLightText text={`Error: ${error}`} />
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="adminProductContainer">
				<AdminHeader title="Products" />
				<AdminLightText text="No products available" />
			</div>
		);
	}

	return (
		<div className="adminProductContainer">
			<AdminHeader title="Products" />

			<div className="adminProductContent">
				{products.map((item) => (
					<AdminLink
						key={item.id}
						text={item.name}
						onPress={() =>
							navigate(`/admin/products/${item.documentId}`, {
								state: { product: item },
							})
						}
					/>
				))}
			</div>
		</div>
	);
};

export default AdminProductsPage;
