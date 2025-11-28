import { useEffect } from "react";
import { useBasket } from "../../contexts/BasketContext";
import { ORDER_STORAGE_KEY, useOrder } from "../../contexts/OrderContext";
import { createOrder } from "../../api";
import "./confirmationPage.css";

const ConfirmationPage: React.FC = () => {
	const { clearBasket } = useBasket();
	const { clearOrder } = useOrder();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const isSuccess = urlParams.get("success") === "true";
		if (!isSuccess) return;

		const saved = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "{}");

		if (import.meta.env.DEV) {
			const basketItems = Array.isArray(saved.basketItems)
				? saved.basketItems
				: [];

			if (basketItems.length > 0) {
				const basketForOrder = basketItems.map((item: any) => ({
					id: item.id,
					quantity: item.quantity,
					selectedPrice: item.selectedPrice,
					selectedOption: item.selectedOption || "",
					product: {
						id: item.product.id,
						documentId: item.product.documentId,
						name: item.product.name,
						price: item.product.price,
						photo: item.product.photo?.[0]?.url || "",
					},
				}));

				createOrder({
					email: saved.form?.email || "",
					phone: saved.form?.phone || "",
					firstName: saved.form?.firstName || "",
					lastName: saved.form?.lastName || "",
					delivery: saved.form?.delivery || "",
					address1: saved.form?.address1 || "",
					address2: saved.form?.address2 || "",
					city: saved.form?.city || "",
					state: saved.form?.state || "",
					postalCode: saved.form?.postalCode || "",
					country: saved.form?.country || "",
					basket: basketForOrder,
					archived: false,
				});
			}
		}

		clearBasket();
		clearOrder();
	}, []);

	return (
		<div className="confirmationPageContainer">
			<p className="confirmationPageText">Thank you for your order!</p>
			<p className="confirmationPageText">
				We’ve received your order and will start processing it shortly.
			</p>
		</div>
	);
};

export default ConfirmationPage;
