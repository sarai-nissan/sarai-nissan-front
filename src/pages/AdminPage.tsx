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
	const [changedOrders, setChangedOrders] = useState<{
		[key: string]: { note?: string; orderStatus?: string };
	}>({});
	const [savingOrders, setSavingOrders] = useState<{ [key: string]: boolean }>(
		{}
	);

	useEffect(() => {
		fetch(`${apiUrl}/api/orders?populate=*`)
			.then((res) => res.json())
			.then((data) => {
				if (data.data) {
					const sortedOrders = data.data.sort(
						(a: Order, b: Order) =>
							new Date(b.createdAt || "").getTime() -
							new Date(a.createdAt || "").getTime()
					);
					setOrders(sortedOrders);
				}
			})
			.finally(() => setLoading(false));
	}, []);

	const pinSubmitHandler = () => {
		if (password === password) {
			setAuthorized(true);
		}
	};

	const changeNoteHandler = (orderId: string, note: string) => {
		setChangedOrders((prev) => ({
			...prev,
			[orderId]: { ...prev[orderId], note },
		}));
	};

	const buttonPressHandler = async (order: Order) => {
		const changes = changedOrders[order.documentId || ""];
		if (!changes) return;

		setSavingOrders((prev) => ({ ...prev, [order.documentId || ""]: true }));
		try {
			const response = await fetch(`${apiUrl}/api/orders/${order.documentId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ data: changes }),
			});
			if (response.ok) {
				const updatedOrder = await response.json();
				setOrders((prev) =>
					prev.map((o) =>
						o.documentId === order.documentId
							? { ...o, ...updatedOrder.data }
							: o
					)
				);
				setChangedOrders((prev) => {
					const { [order.documentId || ""]: _, ...rest } = prev;
					return rest;
				});
			} else {
				console.error("Error while saving:", await response.json());
			}
		} catch (error) {
			console.error("Error while saving changes:", error);
		} finally {
			setSavingOrders((prev) => {
				const { [order.documentId || ""]: _, ...rest } = prev;
				return rest;
			});
		}
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
						autoFocus={false}
					/>
					<ButtonAdmin
						text="Submit"
						onClick={pinSubmitHandler}
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

	if (orders.length === 0)
		return (
			<div className="adminContainer">
				<p className="adminLightText">No orders found</p>
			</div>
		);

	return (
		<div className="adminContainer">
			<div className="adminContainerInner">
				{orders.map((order) => (
					<div key={order.id} className="adminOrder">
						<div className="adminColumnContainer">
							<p className="adminLightText">Products:</p>
							<div className="adminOrderContainer">
								{order.basket.map((item) => (
									<div key={item.id}>
										<p className="adminMediumText">
											{item.product.name} x {item.quantity} pcs{" - "}
											{item.selectedPrice}{" "}
											{item.selectedOption && `(${item.selectedOption})`}
										</p>
									</div>
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
								text="Name"
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
											? "Loading..."
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
								autoFocus={false}
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
