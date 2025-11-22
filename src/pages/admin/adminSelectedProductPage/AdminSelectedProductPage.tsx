import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminLightText from "../components/adminLightText/AdminLightText";
import AdminInput from "../components/adminInput/AdminInput";
import ButtonAdmin from "../components/buttonAdmin/ButtonAdmin";
import { getProductById, updateProductById } from "../../../api";
import type { CategoryType } from "../../../types/FilterContextTypes";
import type { ProductDropdown } from "../../../types/Product";
import { categories } from "../../../constants";
import "./adminSelectedProductPage.css";

type ProductFormType = {
	name: string;
	description?: string;
	price: string;
	size?: string;
	note1?: string;
	note2?: string;
	warning?: string;
	sold: boolean;
	category: CategoryType[];
	dropdownTitle: string;
	dropdown: { label: string; price: string }[];
	enumeration: string[];
};

const AdminSelectedProductPage: React.FC = () => {
	const location = useLocation();
	const { documentId } = useParams();

	const [product, setProduct] = useState<any>(location.state?.product ?? null);
	const [loading, setLoading] = useState(!location.state?.product);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showEnumeration, setShowEnumeration] = useState(false);

	const [productForm, setProductForm] = useState<ProductFormType>({
		name: product?.name || "",
		description: product?.description || "",
		price: product?.price || "",
		size: product?.size || "",
		note1: product?.note1 || "",
		note2: product?.note2 || "",
		warning: product?.warning || "",
		sold: product?.sold || false,
		category: product?.category || [],
		dropdownTitle: product?.dropdownTitle || "",
		dropdown:
			product?.dropdown?.map((d: ProductDropdown) => ({
				label: d.label || "",
				price: d.price || "",
			})) || [],
		enumeration: product?.enumeration || [],
	});

	useEffect(() => {
		if (product) {
			setProductForm({
				name: product.name || "",
				description: product.description || "",
				price: product.price || "",
				size: product.size || "",
				note1: product.note1 || "",
				note2: product.note2 || "",
				warning: product.warning || "",
				sold: product.sold || false,
				category: product.category || [],
				dropdownTitle: product.dropdownTitle || "",
				dropdown:
					product.dropdown?.map((d: ProductDropdown) => ({
						label: d.label || "",
						price: d.price || "",
					})) || [],
				enumeration: product.enumeration || [],
			});
		}
	}, [product]);

	useEffect(() => {
		if (product) return;

		if (!documentId) {
			setError("Missing product id");
			setLoading(false);
			return;
		}

		const loadProduct = async () => {
			try {
				setLoading(true);
				const data = await getProductById(documentId);
				setProduct(data);
			} catch (err: any) {
				console.error("❌ Fetch product error", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadProduct();
	}, [documentId]);

	useEffect(() => {
		const numericPrices = productForm.dropdown
			.map((item) => Number(item.price))
			.filter((n) => !isNaN(n) && n > 0);

		if (numericPrices.length > 0) {
			const minPrice = Math.min(...numericPrices);

			setProductForm((prev) => ({
				...prev,
				price: `from $${minPrice}`,
			}));
		}
	}, [productForm.dropdown]);

	const saveChangesHandler = async () => {
		if (!documentId) return;

		try {
			setMessage(null);

			const payload = {
				...productForm,
				price: productForm.price.trim(),
				category: [...productForm.category],
				dropdown: productForm.dropdown.length ? productForm.dropdown : null,
				enumeration: productForm.enumeration.length
					? productForm.enumeration
					: null,
			};

			await updateProductById(documentId, payload);

			setMessage("✅ Changes saved!");
		} catch (err) {
			console.error(err);
			setMessage("❌ Failed to save changes.");
		}
	};

	if (loading) {
		return (
			<div className="adminSelectedProductContainer">
				<AdminHeader title="Product Details" />
				<AdminLightText text="Loading..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className="adminSelectedProductContainer">
				<AdminHeader title="Product Details" />
				<AdminLightText text={`Error: ${error}`} />
			</div>
		);
	}

	if (!product) {
		return (
			<div className="adminSelectedProductContainer">
				<AdminHeader title="Product Details" />
				<AdminLightText text="Product not found" />
			</div>
		);
	}

	const dropdownHasPrices = productForm.dropdown.some(
		(item) => item.price !== ""
	);

	return (
		<div className="adminSelectedProductContainer">
			<AdminHeader title={productForm.name || "Product Details"} />

			<div className="adminSelectedProductContent">
				<AdminInput
					label="Product Name*"
					value={productForm.name}
					onChange={(e) =>
						setProductForm({ ...productForm, name: e.target.value })
					}
				/>

				<AdminInput
					label="Description"
					value={productForm.description || ""}
					onChange={(e) =>
						setProductForm({ ...productForm, description: e.target.value })
					}
				/>

				<AdminInput
					label={
						dropdownHasPrices
							? "Price (disabled — dropdown prices used)"
							: "Price*"
					}
					value={productForm.price}
					onChange={(e) =>
						setProductForm({ ...productForm, price: e.target.value })
					}
					inputStyle={
						dropdownHasPrices
							? { background: "#eee", pointerEvents: "none" }
							: {}
					}
				/>

				<div className="adminSelectedProductSoldOutContent">
					<p>Sold out</p>

					<div className="adminSelectedProductSoldOutOptions">
						<label>
							<input
								className="adminSelectedProductCategoriesInput"
								type="radio"
								checked={productForm.sold === true}
								onChange={() => setProductForm({ ...productForm, sold: true })}
							/>
							Yes
						</label>
						<label>
							<input
								className="adminSelectedProductCategoriesInput"
								type="radio"
								checked={productForm.sold === false}
								onChange={() => setProductForm({ ...productForm, sold: false })}
							/>
							No
						</label>
					</div>
				</div>

				<AdminInput
					label="Size"
					value={productForm.size || ""}
					onChange={(e) =>
						setProductForm({ ...productForm, size: e.target.value })
					}
				/>

				<AdminInput
					label="Note"
					value={productForm.note1 || ""}
					onChange={(e) =>
						setProductForm({ ...productForm, note1: e.target.value })
					}
				/>

				<AdminInput
					label="Note"
					value={productForm.note2 || ""}
					onChange={(e) =>
						setProductForm({ ...productForm, note2: e.target.value })
					}
				/>

				<AdminInput
					label="Warning"
					value={productForm.warning || ""}
					onChange={(e) =>
						setProductForm({ ...productForm, warning: e.target.value })
					}
				/>

				<div className="adminSelectedProductCategories">
					<p className="adminSelectedProductText">Categories:</p>
					{categories.map((cat) => (
						<label key={cat}>
							<input
								className="adminSelectedProductCategoriesInput"
								type="checkbox"
								checked={productForm.category.includes(cat)}
								onChange={(e) => {
									if (e.target.checked) {
										setProductForm({
											...productForm,
											category: [...productForm.category, cat],
										});
									} else {
										setProductForm({
											...productForm,
											category: productForm.category.filter((c) => c !== cat),
										});
									}
								}}
							/>
							{cat}
						</label>
					))}
				</div>

				<div className="adminSelectedProductDropdownContainer">
					<div
						className="adminSelectedProductDropdownHeader"
						onClick={() => setShowDropdown((prev) => !prev)}
					>
						<p className="adminSelectedProductText">Dropdown</p>
						<p className="adminSelectedProductText">
							({showDropdown ? "Hide" : "Show"})
						</p>
					</div>

					{showDropdown && (
						<div className="adminSelectedProductDropdownContent">
							<AdminInput
								label="Dropdown Title"
								value={productForm.dropdownTitle}
								onChange={(e) =>
									setProductForm({
										...productForm,
										dropdownTitle: e.target.value,
									})
								}
							/>

							<p className="adminSelectedProductDropdownText">
								Dropdown Items:
							</p>

							{productForm.dropdown.map((item, index) => (
								<div key={index} className="adminSelectedProductDropdownItem">
									<AdminInput
										inputContainerStyle={{ marginTop: "0" }}
										label="Label"
										value={item.label}
										onChange={(e) => {
											const updated = [...productForm.dropdown];
											updated[index].label = e.target.value;
											setProductForm({ ...productForm, dropdown: updated });
										}}
									/>

									<div className="adminSelectedProductDropdownItemBottom">
										<AdminInput
											label="Price"
											value={item.price}
											onChange={(e) => {
												const updated = [...productForm.dropdown];
												updated[index].price = e.target.value;
												setProductForm({ ...productForm, dropdown: updated });
											}}
										/>

										<ButtonAdmin
											text="Remove"
											onClick={() => {
												const updated = productForm.dropdown.filter(
													(_, i) => i !== index
												);
												setProductForm({ ...productForm, dropdown: updated });
											}}
											styles={{ height: "40px" }}
										/>
									</div>
								</div>
							))}

							<div className="adminSelectedProductAddItemButton">
								<ButtonAdmin
									text="Add Item"
									onClick={() =>
										setProductForm({
											...productForm,
											dropdown: [
												...productForm.dropdown,
												{ label: "", price: "" },
											],
										})
									}
								/>
							</div>
						</div>
					)}
				</div>

				<div className="adminSelectedProductDropdownContainer">
					<div
						className="adminSelectedProductDropdownHeader"
						onClick={() => setShowEnumeration((prev) => !prev)}
					>
						<p className="adminSelectedProductText">Characteristics</p>
						<p className="adminSelectedProductText">
							({showEnumeration ? "Hide" : "Show"})
						</p>
					</div>

					{showEnumeration && (
						<div className="adminSelectedProductDropdownContent">
							{productForm.enumeration?.map((item, index) => (
								<div key={index} className="adminSelectedProductDropdownItem">
									<AdminInput
										inputContainerStyle={{ marginTop: "0" }}
										label={`Characteristic #${index + 1}`}
										value={item}
										onChange={(e) => {
											const updated = [...productForm.enumeration];
											updated[index] = e.target.value;
											setProductForm({
												...productForm,
												enumeration: updated,
											});
										}}
									/>

									<div className="adminSelectedProductAddItemButton">
										<ButtonAdmin
											text="Remove"
											onClick={() => {
												const updated = productForm.enumeration.filter(
													(_, i) => i !== index
												);
												setProductForm({
													...productForm,
													enumeration: updated,
												});
											}}
											styles={{
												marginTop: "-4px",
											}}
										/>
									</div>
								</div>
							))}

							<div className="adminSelectedProductAddItemButton">
								<ButtonAdmin
									text="Add Characteristic"
									onClick={() =>
										setProductForm({
											...productForm,
											enumeration: [...(productForm.enumeration || []), ""],
										})
									}
								/>
							</div>
						</div>
					)}
				</div>

				<ButtonAdmin
					text={message ? message : "Save Changes"}
					onClick={saveChangesHandler}
					styles={{ marginTop: "20px" }}
				/>
			</div>
		</div>
	);
};

export default AdminSelectedProductPage;
