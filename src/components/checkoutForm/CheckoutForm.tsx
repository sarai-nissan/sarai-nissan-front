import { useEffect, useState } from "react";
import { ORDER_STORAGE_KEY, useOrder } from "../../contexts/OrderContext";
import { useBasket } from "../../contexts/BasketContext";
import CheckoutButton from "../checkoutButton/CheckoutButton";
import InputDropDown from "../inputDropDown/InputDropDown";
import Input from "../input/Input";
import {
	countryNames,
	internationalDeliveryType,
	shippedCountries,
	usDeliveryType,
} from "../../constants";
import type {
	DeliveryId,
	OrderData,
	OrderForm,
} from "../../types/OrderContext";
import "./checkoutForm.css";

const defaultForm: OrderForm = {
	email: "",
	phone: "",
	delivery: "ground",
	firstName: "",
	lastName: "",
	address1: "",
	address2: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
};

const CheckoutForm: React.FC = () => {
	const { basket } = useBasket();
	const { order, setOrder } = useOrder();
	const [clickCounter, setClickCounter] = useState<number>(0);

	const [form, setForm] = useState<OrderForm>(() => {
		let savedForm: Partial<OrderForm> | null = null;
		try {
			const saved = localStorage.getItem(ORDER_STORAGE_KEY);
			if (saved) savedForm = JSON.parse(saved)?.form ?? null;
		} catch {}

		return {
			...defaultForm,
			...savedForm,
			...order?.form,
			delivery:
				(savedForm?.delivery as DeliveryId) ??
				(order?.form?.delivery as DeliveryId) ??
				"ground",
		};
	});

	const delivery =
		form.country === "" || form.country === "US"
			? usDeliveryType
			: internationalDeliveryType;

	useEffect(() => {
		const availableDelivery =
			form.country === "US" || form.country === ""
				? usDeliveryType
				: internationalDeliveryType;

		if (!availableDelivery.some((opt) => opt.id === form.delivery)) {
			const fallbackDelivery: DeliveryId = availableDelivery[0].id;
			const updatedForm: OrderForm = {
				...form,
				delivery: fallbackDelivery,
			};
			setForm(updatedForm);

			const newOrder: OrderData = {
				form: updatedForm,
				basketItems: basket,
			};
			setOrder(newOrder);

			try {
				localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newOrder));
			} catch {}
		}
	}, [form.country]);

	useEffect(() => {
		if (order?.form) {
			setForm((prev) => ({
				...prev,
				...order.form,
				delivery:
					(order.form.delivery as DeliveryId) ?? prev.delivery ?? "ground",
			}));
		}
	}, [order]);

	const changeHandler = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		const updatedForm: OrderForm = {
			...form,
			[name]: name === "delivery" ? (value as DeliveryId) : value,
		} as OrderForm;

		setForm(updatedForm);

		const newOrder = { form: updatedForm, basketItems: basket };
		setOrder(newOrder);

		try {
			localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newOrder));
		} catch {}
	};

	const clickHandler = () => {
		setClickCounter((prev) => prev + 1);
		if (clickCounter === 1) {
			setClickCounter(0);
			clearForm();
		}
		setTimeout(() => {
			setClickCounter(0);
		}, 3000);
	};

	const clearForm = () => {
		setForm(defaultForm);
		setOrder({ form: defaultForm, basketItems: [] });
		localStorage.removeItem(ORDER_STORAGE_KEY);
	};

	return (
		<div className="checkoutFormContainer">
			<Input
				label="Your Email"
				type="email"
				name="email"
				value={form.email}
				onChange={changeHandler}
			/>
			<Input
				label="Your Phone"
				type="phone"
				name="phone"
				value={form.phone}
				onChange={changeHandler}
			/>

			<p className="checkoutFormDeliveryTitle">Delivery Options</p>
			<div className="checkoutFormDeliveryOptionsContainer">
				{delivery.map((option) => (
					<div key={option.id} className="checkoutFormDeliveryOption">
						<input
							type="radio"
							id={option.id}
							name="delivery"
							value={option.id}
							checked={form.delivery === option.id}
							onChange={changeHandler}
							className="checkoutFormRadioInput"
						/>
						<label htmlFor={option.id} className="checkoutFormDeliveryLabel">
							{option.label} – ${option.price}
						</label>
					</div>
				))}
			</div>

			<p className="checkoutFormDeliveryTitle">Shipping Information</p>
			<div className="checkoutFormDoubleContainer">
				<Input
					label="First Name"
					name="firstName"
					value={form.firstName}
					onChange={changeHandler}
				/>
				<Input
					label="Last Name"
					name="lastName"
					value={form.lastName}
					onChange={changeHandler}
				/>
			</div>

			<Input
				label="Address 1"
				name="address1"
				value={form.address1}
				onChange={changeHandler}
			/>

			<Input
				label="Address 2"
				name="address2"
				value={form.address2}
				onChange={changeHandler}
			/>

			<div className="checkoutFormDoubleContainer">
				<Input
					label="City"
					name="city"
					value={form.city}
					onChange={changeHandler}
				/>
				<Input
					label="State"
					name="state"
					value={form.state}
					onChange={changeHandler}
				/>
			</div>

			<div className="checkoutFormDoubleContainer">
				<Input
					label="Postal Code"
					name="postalCode"
					value={form.postalCode}
					onChange={changeHandler}
				/>
				<InputDropDown
					label="Country"
					value={form.country}
					onChange={changeHandler}
					optionValues={shippedCountries}
					countryNames={countryNames}
				/>
			</div>

			<p onClick={clickHandler} className="checkoutFormClearFormText">
				{clickCounter === 0 && "Clear Form"}
				{clickCounter === 1 && "Are you sure?"}
			</p>

			<CheckoutButton
				email={form.email}
				disabled={
					!form.email ||
					!form.phone ||
					!form.delivery ||
					!form.firstName ||
					!form.lastName ||
					!form.address1 ||
					!form.city ||
					!form.state ||
					!form.postalCode ||
					!form.country
				}
			/>
		</div>
	);
};

export default CheckoutForm;
