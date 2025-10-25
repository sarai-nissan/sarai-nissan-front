import { useEffect, useState, type CSSProperties } from "react";
import AdminLineText from "../components/adminLineText/AdminLineText";
import ButtonAdmin from "../components/buttonAdmin/ButtonAdmin";
import Input from "../components/input/Input";
import { internationalDeliveryType, usDeliveryType } from "../constants";
import type { Order } from "../types/AdminPage";
import "../styles/adminPage.css";

const apiUrl = import.meta.env.VITE_STRAPI_API_URL;

const AdminPage: React.FC = () => {
	const deliveryMethods = [...usDeliveryType, ...internationalDeliveryType];

	const [authorized, setAuthorized] = useState(false);
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState<Order[]>([]);
	const [changedOrders, setChangedOrders] = useState<
		Record<string, { note?: string; orderStatus?: string }>
	>({});
	const [savingOrders, setSavingOrders] = useState<Record<string, boolean>>({});
	const [error, setError] = useState<string | null>(null);

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

	const changeNoteHandler = (orderId: string, note: string) => {
		setChangedOrders((prev) => ({
			...prev,
			[orderId]: { ...prev[orderId], note },
		}));
	};

	const buttonPressHandler = async (order: Order) => {
		const orderId = order.documentId || "";
		const changes = changedOrders[orderId];
		if (!changes) return;

		setSavingOrders((prev) => ({ ...prev, [orderId]: true }));
		try {
			const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ data: changes }),
			});

			if (!response.ok) throw new Error("Error while saving changes");

			const updatedOrder = await response.json();
			setOrders((prev) =>
				prev.map((o) =>
					o.documentId === orderId ? { ...o, ...updatedOrder.data } : o
				)
			);

			setChangedOrders((prev) => {
				const { [orderId]: _, ...rest } = prev;
				return rest;
			});
		} catch (error) {
			console.error("Error while saving:", error);
			alert("Failed to save changes");
		} finally {
			setSavingOrders((prev) => {
				const { [orderId]: _, ...rest } = prev;
				return rest;
			});
		}
	};

	const logoutHandler = () => {
		setAuthorized(false);
		localStorage.removeItem("isLogged");
	};

	if (!authorized)
		return (
			<div className="adminContainer">
				<div className="adminContainerInner" style={styles.adminContainerInner}>
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

	if (orders.length === 0)
		return (
			<div className="adminContainer">
				<p className="adminLightText">No orders found</p>
			</div>
		);

	return (
		<div className="adminContainer">
			<div className="adminHeader">
				<button className="adminExitButton" onClick={logoutHandler}>
					exit
				</button>
			</div>

			<div className="adminContainerInner">
				{orders.map((order) => (
					<div key={order.id} className="adminOrder">
						<div className="adminColumnContainer">
							<p className="adminLightText">Products:</p>
							<div className="adminOrderContainer">
								{order.basket.map((item) => (
									<p key={item.id} className="adminMediumText">
										{item.product.name} × {item.quantity} pcs —{" "}
										{item.selectedPrice}{" "}
										{item.selectedOption && `(${item.selectedOption})`}
									</p>
								))}
							</div>
							<AdminLineText
								text="delivery method"
								info={
									deliveryMethods.find((d) => d.id === order.delivery)?.label ||
									order.delivery
								}
							/>
						</div>

						<div className="adminColumnContainer">
							<p className="adminLightText">Shipping Info:</p>
							<AdminLineText text="email" info={order.email} />
							<AdminLineText text="phone" info={order.phone} />
							<AdminLineText
								text="name"
								info={`${order.firstName} ${order.lastName}`}
							/>
							<AdminLineText text="address 1" info={order.address1} />
							{order.address2 && (
								<AdminLineText text="address 2" info={order.address2} />
							)}
							<AdminLineText text="city" info={order.city} />
							<AdminLineText text="state" info={order.state} />
							<AdminLineText text="postal code" info={order.postalCode} />
							<AdminLineText text="country" info={order.country} />
						</div>

						<div className="adminColumnContainer">
							<div className="adminRowContainer">
								<ButtonAdmin
									text={
										savingOrders[order.documentId || ""]
											? "Saving..."
											: "Save changes"
									}
									styles={styles.saveButtonStyles}
									textStyle={styles.saveButtonTextStyle}
									disabled={
										!changedOrders[order.documentId || ""] ||
										savingOrders[order.documentId || ""]
									}
									onClick={() => buttonPressHandler(order)}
								/>
							</div>
							<textarea
								className="adminTextarea"
								placeholder="Add a note..."
								defaultValue={order.note || ""}
								onChange={(e) =>
									changeNoteHandler(order.documentId || "", e.target.value)
								}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminPage;

const styles: { [key: string]: CSSProperties } = {
	adminContainerInner: {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	pinInputContainer: {
		display: "flex",
		flexDirection: "column",
		width: "180px",
		alignSelf: "center",
		marginTop: "0.5rem",
	},
	pinInputStyle: {
		backgroundColor: "transparent",
		border: "1px solid #fff",
		color: "#fff",
		textAlign: "center",
	},
	pinButtonStyle: {
		border: "1px solid #fff",
		marginTop: "1rem",
		width: "180px",
	},
	pinButtonTextStyle: { color: "#fff" },
	saveButtonStyles: {
		border: "1px solid #fff",
		padding: "8px",
		width: "100px",
	},
	saveButtonTextStyle: { color: "#fff", fontSize: "0.8rem" },
};
