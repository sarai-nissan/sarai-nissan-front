import { loadStripe } from "@stripe/stripe-js";
import { useBasket } from "../../../../contexts/BasketContext";
import { useSettingsStore } from "../../../../store/useSettingsStore";
import { ORDER_STORAGE_KEY, useOrder } from "../../../../contexts/OrderContext";
import Button from "../../../../components/button/Button";
import { createCheckoutSession } from "../../../../api";
import {
	taxesPercent,
	usDeliveryType,
	internationalDeliveryType,
} from "../../../../constants";
import "./checkoutButton.css";

interface CheckoutButtonProps {
	disabled?: boolean;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ disabled }) => {
	const { order, setOrder, initOrderFromBasket } = useOrder();
	const { basket } = useBasket();

	const { taxPercent, usDelivery, internationalDelivery } = useSettingsStore();

	const fallbackUS = usDelivery.length > 0 ? usDelivery : usDeliveryType;
	const fallbackInternational =
		internationalDelivery.length > 0
			? internationalDelivery
			: internationalDeliveryType;

	const deliveryList =
		order?.form.country === "" || order?.form.country === "US"
			? fallbackUS
			: fallbackInternational;

	const shippingPrice =
		deliveryList.find((d) => d.uid === order?.form.delivery)?.price ?? 0;

	const subtotalAmount = basket.reduce((acc, item) => {
		const itemPrice = Number(item.selectedPrice.replace("$", ""));
		return acc + itemPrice * item.quantity;
	}, 0);

	const taxesPrice = subtotalAmount * (taxPercent?.taxPercent ?? taxesPercent);

	const checkoutHandler = async () => {
		try {
			const orderToSave = order ?? initOrderFromBasket(basket);
			setOrder(orderToSave);

			try {
				localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderToSave));
			} catch (e) {
				console.warn("Failed to local-save order before redirect", e);
			}

			const stripe = await stripePromise;
			if (!stripe) {
				console.error("Stripe failed to initialize");
				return;
			}

			const payload = {
				basketItems: basket.map((item) => ({
					name: item.product.name,
					price: Number(item.selectedPrice.replace("$", "")) * 100,
					quantity: item.quantity,
					option: item.selectedOption || "",
				})),

				form: {
					email: orderToSave.form.email,
					phone: orderToSave.form.phone,
					firstName: orderToSave.form.firstName,
					lastName: orderToSave.form.lastName,
					delivery: orderToSave.form.delivery,
					address1: orderToSave.form.address1,
					address2: orderToSave.form.address2,
					city: orderToSave.form.city,
					state: orderToSave.form.state,
					postalCode: orderToSave.form.postalCode,
					country: orderToSave.form.country,
				},

				shippingCost: shippingPrice * 100,
				taxAmount: Math.round(taxesPrice * 100),
			};

			const data = await createCheckoutSession(payload);

			if (!data.id) {
				console.error("Failed to create Stripe session:", data);
				return;
			}

			const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
			if (error) {
				console.error("Stripe checkout error:", error.message);
			}
		} catch (err) {
			console.error("Checkout error:", err);
		}
	};

	return (
		<Button
			text="Pay Now"
			onClick={checkoutHandler}
			disabled={disabled}
			buttonClassName="checkoutButton"
		/>
	);
};

export default CheckoutButton;
