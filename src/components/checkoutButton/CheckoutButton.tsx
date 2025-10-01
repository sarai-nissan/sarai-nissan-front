import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { usDeliveryType, taxesPercent } from "../../constants";
import { useOrder } from "../../contexts/OrderContext";
import { useBasket } from "../../contexts/BasketContext";
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
				localStorage.setItem("order", JSON.stringify(orderToSave));
			} catch (e) {
				console.warn("Failed to local-save order before redirect", e);
			}

			const stripe = await stripePromise;
			if (!stripe) {
				console.error("Stripe failed to initialize");
				return;
			}

			const response = await fetch(
				`${import.meta.env.VITE_STRAPI_API_URL}/api/checkout`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						basketItems: basket.map((item) => ({
							name: item.product.name,
							price: Number(item.selectedPrice.replace("$", "")) * 100,
							quantity: item.quantity,
							option: item.selectedOption || "",
						})),
						email,
						shippingCost: shippingPrice ? shippingPrice * 100 : 0,
						taxAmount: taxesPrice ? Math.round(taxesPrice * 100) : 0,
					}),
				}
			);

			const data = await response.json();

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
		<button
			onClick={checkoutHandler}
			className="checkoutButton"
			disabled={disabled}
		>
			Pay Now
		</button>
	);
};

export default CheckoutButton;
