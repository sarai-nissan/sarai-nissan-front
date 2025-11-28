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

const safeParsePrice = (value: any) => {
	if (!value) return 0;
	if (typeof value === "number") return value;

	if (typeof value === "string") {
		const num = Number(value.replace("$", "").trim());
		return isNaN(num) ? 0 : num;
	}

	return 0;
};

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

	const subtotal = basket.reduce((acc, item) => {
		const price = safeParsePrice(item.selectedPrice || item.product.price);
		return acc + price * item.quantity;
	}, 0);

	const taxesPrice = subtotal * (taxPercent?.taxPercent ?? taxesPercent);

	const checkoutHandler = async () => {
		try {
			const orderToSave = order ?? initOrderFromBasket(basket);
			setOrder(orderToSave);

			localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderToSave));

			const stripe = await stripePromise;
			if (!stripe) {
				console.error("Stripe failed to initialize");
				return;
			}

			const basketToSend = basket.map((item) => ({
				id: item.id,
				quantity: item.quantity,
				selectedPrice: item.selectedPrice,
				selectedOption: item.selectedOption || "",
				product: {
					id: item.product.id,
					documentId: item.product.documentId,
					name: item.product.name,
					price: item.product.price,
				},
			}));

			const data = await createCheckoutSession({
				basketItems: basketToSend,
				form: orderToSave.form,
				shippingCost: shippingPrice * 100,
				taxAmount: Math.round(taxesPrice * 100),
			});

			if (!data.id) {
				console.error("No session id returned:", data);
				return;
			}

			const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
			if (error) console.error("Stripe redirect error:", error.message);
		} catch (error) {
			console.error("Checkout error:", error);
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
