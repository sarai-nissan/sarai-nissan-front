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
	email?: string;
	disabled?: boolean;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ email, disabled }) => {
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

			const data = await createCheckoutSession({
				basketItems: basket.map((item) => ({
					name: item.product.name,
					price: Number(item.selectedPrice.replace("$", "")) * 100,
					quantity: item.quantity,
					option: item.selectedOption || "",
				})),
				email,
				shippingCost: shippingPrice * 100,
				taxAmount: Math.round(taxesPrice * 100),
			});

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
