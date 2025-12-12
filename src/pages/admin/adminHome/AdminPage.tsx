import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../../contexts/OrdersContext";
import { useEventStore } from "../../../store/useEventStore";
import { useProductStore } from "../../../store/useProductStore";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminInput from "../components/adminInput/AdminInput";
import AdminLightText from "../components/adminLightText/AdminLightText";
import ButtonAdmin from "../components/buttonAdmin/ButtonAdmin";
import AdminLink from "../components/adminLink/AdminLink";
import { checkAdminPin } from "../../../api";
import type { Order } from "../../../types/AdminPage";
import "./adminPage.css";

const AdminPage: React.FC = () => {
	const navigation = useNavigate();
	const [authorized, setAuthorized] = useState(false);
	const [password, setPassword] = useState("");
	const { products } = useProductStore();
	const { events } = useEventStore();
	const { orders, loading, error: ordersError } = useOrders();

	useEffect(() => {
		const loggedIn = localStorage.getItem("isLogged");
		if (loggedIn === "true") setAuthorized(true);
	}, []);

	const loginHandler = async () => {
		try {
			const result = await checkAdminPin(password);

			if (result.success) {
				localStorage.setItem("isLogged", "true");
				setAuthorized(true);
				setPassword("");
			} else {
				alert("Wrong PIN");
				setPassword("");
			}
		} catch (error) {
			console.error(error);
			alert("Server error");
		}
	};

	const logoutHandler = () => {
		setAuthorized(false);
		localStorage.removeItem("isLogged");
	};

	if (!authorized)
		return (
			<div className="adminContainer">
				<div className="adminLoginContainer">
					<AdminLightText text="Enter admin password:" />
					<AdminInput
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						inputContainerStyle={styles.pinInputContainer}
						inputStyle={styles.pinInputStyle}
						autoFocus
					/>
					<ButtonAdmin
						text="Submit"
						onClick={loginHandler}
						styles={styles.pinButtonStyle}
					/>
				</div>
			</div>
		);

	if (loading)
		return (
			<div className="adminContainer">
				<AdminLightText text="Loading..." />
			</div>
		);

	if (ordersError)
		return (
			<div className="adminContainer">
				<AdminLightText text={ordersError} />
			</div>
		);

	const activeOrders = orders.filter((o: Order) => !o.archived);
	const archivedOrders = orders.filter((o: Order) => o.archived);

	const productNavigateHandler = () => navigation("/admin/products");
	const orderNavigateHandler = () => navigation("/admin/orders");
	const archivedOrderNavigateHandler = () => navigation("/admin/archived");
	const eventsNavigateHandler = () => navigation("/admin/events");
	const deliverySettingsNavigateHandler = () =>
		navigation("/admin/delivery-settings");

	return (
		<div className="adminContainer">
			<div className="adminContainerInner">
				<AdminHeader
					title="Admin"
					showBackButton={false}
					menuItems={[{ label: "Exit", action: logoutHandler }]}
				/>

				<AdminLink
					text={`Products (${products.length})`}
					onPress={productNavigateHandler}
				/>
				<AdminLink
					text={`Orders (${activeOrders.length})`}
					onPress={orderNavigateHandler}
				/>
				<AdminLink
					text={`Archived Orders (${archivedOrders.length})`}
					onPress={archivedOrderNavigateHandler}
				/>
				<AdminLink
					text={`Events (${events.length})`}
					onPress={eventsNavigateHandler}
				/>
				<AdminLink
					text="Delivery and Taxes Settings"
					onPress={deliverySettingsNavigateHandler}
				/>
			</div>
		</div>
	);
};

export default AdminPage;

const styles: { [key: string]: CSSProperties } = {
	pinInputContainer: {
		width: "180px",
	},
	pinInputStyle: {
		borderRadius: "50px",
		textAlign: "center",
	},
	pinButtonStyle: {
		marginTop: "1rem",
		borderRadius: "50px",
		width: "140px",
	},
};
