import { useEffect } from "react";
import { useBasket } from "../../contexts/BasketContext";
import { ORDER_STORAGE_KEY, useOrder } from "../../contexts/OrderContext";
import { createOrder } from "../../api";
import type { Order } from "../../types/AdminPage";
import type { BasketElement } from "../../types/BasketContext";
import "./confirmationPage.css";

const ConfirmationPage: React.FC = () => {
	const { clearBasket } = useBasket();
	const { clearOrder } = useOrder();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);

		if (urlParams.get("success") === "true") {
			const savedOrder = JSON.parse(
				localStorage.getItem(ORDER_STORAGE_KEY) || "{}"
			);

			if (savedOrder && savedOrder.basketItems?.length) {
				const basketItemsJson = savedOrder.basketItems.map(
					(item: BasketElement) => ({
						id: item.id,
						quantity: item.quantity,
						product: {
							id: item.product.id,
							name: item.product.name,
							price: item.product.price,
							photo: item.product.photo[0].url,
						},
						selectedPrice: item.selectedPrice,
						selectedOption: item.selectedOption || null,
					})
				);
				const orderPayload: Order = {
					email: savedOrder.form.email,
					phone: savedOrder.form.phone,
					delivery: savedOrder.form.delivery,
					firstName: savedOrder.form.firstName,
					lastName: savedOrder.form.lastName,
					address1: savedOrder.form.address1,
					address2: savedOrder.form.address2,
					city: savedOrder.form.city,
					state: savedOrder.form.state,
					postalCode: savedOrder.form.postalCode,
					country: savedOrder.form.country,
					basket: basketItemsJson,
					archived: false,
				};

				createOrder(orderPayload)
					.then(() => console.log("Order submitted"))
					.catch((err) => console.error("Failed:", err));

				localStorage.removeItem(ORDER_STORAGE_KEY);
				clearBasket();
				clearOrder();
			}
		}
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
