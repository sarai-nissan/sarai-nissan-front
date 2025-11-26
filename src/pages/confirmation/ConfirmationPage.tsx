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
		if (urlParams.get("success") !== "true") return;

		setTimeout(() => {
			const saved = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "{}");

			if (saved?.basketItems?.length) {
				createOrder({
					email: saved.form.email,
					phone: saved.form.phone,
					delivery: saved.form.delivery,
					firstName: saved.form.firstName,
					lastName: saved.form.lastName,
					address1: saved.form.address1,
					address2: saved.form.address2,
					city: saved.form.city,
					state: saved.form.state,
					postalCode: saved.form.postalCode,
					country: saved.form.country,
					basket: saved.basketItems,
					archived: false,
				});
			}

			clearBasket();
			clearOrder();
		}, 200);
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
