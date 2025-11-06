import { loadStripe } from "@stripe/stripe-js";
import { useBasket } from "../../../../contexts/BasketContext";
import { ORDER_STORAGE_KEY, useOrder } from "../../../../contexts/OrderContext";
import Button from "../../../../components/button/Button";
import { createCheckoutSession } from "../../../../api";
import { usDeliveryType, taxesPercent } from "../../../../constants";
import "./checkoutButton.css";

interface CheckoutButtonProps {
	email?: string;
	disabled?: boolean;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ email, disabled }) => {
	const { order, setOrder, initOrderFromBasket } = useOrder();
	const { basket } = useBasket();

	const shippingPrice = usDeliveryType.find(
		(d) => d.id === order?.form.delivery
	)?.price;

	const subtotalAmount = basket.reduce((acc, item) => {
		const itemPrice = Number(item.selectedPrice.replace("$", ""));
		return acc + itemPrice * item.quantity;
	}, 0);

	const taxesPrice = subtotalAmount * taxesPercent;

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
				shippingCost: shippingPrice ? shippingPrice * 100 : 0,
				taxAmount: taxesPrice ? Math.round(taxesPrice * 100) : 0,
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
