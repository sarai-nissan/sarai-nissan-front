import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminPageLink from "../components/adminPageLink/AdminPageLink";
import ButtonAdmin from "../components/buttonAdmin/ButtonAdmin";
import Input from "../components/input/Input";
import type { Order } from "../types/AdminPage";
import "../styles/adminPage.css";

const apiUrl = import.meta.env.VITE_STRAPI_API_URL;

const AdminPage: React.FC = () => {
	const navigation = useNavigate();
	const [authorized, setAuthorized] = useState(false);
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const loggedIn = localStorage.getItem("isLogged");
		if (loggedIn === "true") setAuthorized(true);

		const controller = new AbortController();

		const loadOrders = async () => {
			try {
				const res = await fetch(`${apiUrl}/api/orders?populate=*`, {
					signal: controller.signal,
				});
				if (!res.ok) throw new Error("Failed to fetch orders");

				const data = await res.json();
				if (data.data) {
					const sortedOrders = data.data.sort(
						(a: Order, b: Order) =>
							new Date(b.createdAt || "").getTime() -
							new Date(a.createdAt || "").getTime()
					);
					setOrders(sortedOrders);
				}
			} catch (err: any) {
				if (err.name !== "AbortError") {
					console.error(err);
					setError("Error loading orders");
				}
			} finally {
				setLoading(false);
			}
		};

		loadOrders();
		return () => controller.abort();
	}, []);

	const loginHandler = async () => {
		try {
			const res = await fetch(`${apiUrl}/api/check-pin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pin: password }),
			});

			const result = await res.json();

			if (result.success) {
				setAuthorized(true);
				localStorage.setItem("isLogged", "true");
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

	const activeOrders = orders.filter((order) => !order.archived);
	const archivedOrders = orders.filter((order) => order.archived);

	const orderNavigateHandler = () =>
		navigation("/admin/orders", { state: { orders: activeOrders } });

	const archivedOrderNavigateHandler = () =>
		navigation("/admin/archived", { state: { orders: archivedOrders } });

	if (!authorized)
		return (
			<div className="adminContainer">
				<div className="adminLoginContainer">
					<p className="adminLightText">Enter admin password:</p>
					<Input
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
						textStyle={styles.pinButtonTextStyle}
					/>
				</div>
			</div>
		);

	if (loading)
		return (
			<div className="adminContainer">
				<p className="adminLightText">Loading...</p>
			</div>
		);

	if (error)
		return (
			<div className="adminContainer">
				<p className="adminLightText">{error}</p>
			</div>
		);

	return (
		<div className="adminContainer">
			<div className="adminContainerInner">
				<AdminHeader
					title="Order Details"
					showBackButton={false}
					menuItems={[
						{
							label: "Exit",
							action: () => {
								logoutHandler();
							},
						},
					]}
				/>

				<AdminPageLink
					text={`Orders (${activeOrders.length})`}
					onPress={orderNavigateHandler}
				/>
				<AdminPageLink
					text={`Archived Orders (${archivedOrders.length})`}
					onPress={archivedOrderNavigateHandler}
				/>
			</div>
		</div>
	);
};

export default AdminPage;

const styles: { [key: string]: CSSProperties } = {
	pinInputContainer: {
		display: "flex",
		flexDirection: "column",
		width: "180px",
		alignSelf: "center",
		marginTop: "1rem",
	},
	pinInputStyle: {
		backgroundColor: "transparent",
		border: "1px solid #000",
		borderRadius: "50px",
		color: "#000",
		textAlign: "center",
	},
	pinButtonStyle: {
		border: "1px solid #000",
		marginTop: "1rem",
		borderRadius: "50px",
		width: "180px",
	},
	pinButtonTextStyle: { color: "#000" },
};
