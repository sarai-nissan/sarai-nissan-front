import CheckoutBasket from "../components/checkoutBasket/CheckoutBasket";
import CheckoutForm from "../components/checkoutForm/CheckoutForm";
import "../styles/checkoutPage.css";

const CheckoutPage: React.FC = () => {
	return (
		<div className="checkoutPageContainer">
			<CheckoutBasket />
			<CheckoutForm />
		</div>
	);
};

export default CheckoutPage;
