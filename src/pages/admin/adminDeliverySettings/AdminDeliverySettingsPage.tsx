import { useEffect, useState } from "react";
import { useSettingsStore } from "../../../store/useSettingsStore";
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminInput from "../components/adminInput/AdminInput";
import AdminLightText from "../components/adminLightText/AdminLightText";
import ButtonAdmin from "../components/buttonAdmin/ButtonAdmin";
import { updateShippingOption, updateTaxPercent } from "../../../api";
import "./adminDeliverySettingsPage.css";

const AdminDeliverySettingsPage: React.FC = () => {
	const { shippingOptions, taxPercent, isLoading, error, fetchSettings } =
		useSettingsStore();

	const [localOptions, setLocalOptions] = useState(() =>
		shippingOptions.map((o) => ({
			documentId: o.documentId,
			label: o.label,
			price: o.price,
		}))
	);

	const [localTax, setLocalTax] = useState(
		taxPercent?.taxPercent?.toString() ?? ""
	);

	const [message, setMessage] = useState("");

	useEffect(() => {
		if (shippingOptions.length) {
			setLocalOptions(
				shippingOptions.map((o) => ({
					documentId: o.documentId,
					label: o.label,
					price: o.price,
				}))
			);
		}

		if (taxPercent) {
			setLocalTax(taxPercent.taxPercent.toString());
		}
	}, [shippingOptions, taxPercent]);

	const updateOptionField = (
		documentId: string,
		field: string,
		value: string
	) => {
		setLocalOptions((prev) =>
			prev.map((opt) =>
				opt.documentId === documentId
					? { ...opt, [field]: field === "price" ? Number(value) : value }
					: opt
			)
		);
	};

	const saveChangesHandler = async () => {
		try {
			setMessage("Saving...");

			for (const opt of localOptions) {
				await updateShippingOption(opt.documentId, {
					label: opt.label,
					price: opt.price,
				});
			}

			if (taxPercent?.documentId) {
				await updateTaxPercent(taxPercent.documentId, {
					taxPercent: Number(localTax),
				});
			} else {
				throw new Error("No tax documentId found");
			}

			await fetchSettings(true);

			setMessage("Saved successfully ✔");
			setTimeout(() => setMessage(""), 2000);
		} catch (err) {
			console.error(err);
			setMessage("Failed to save ❌");
			setTimeout(() => setMessage(""), 3000);
		}
	};

	if (isLoading) {
		return (
			<div className="adminDeliverySettingsPageContainer">
				<AdminHeader title="Settings" />
				<AdminLightText text="Loading..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className="adminDeliverySettingsPageContainer">
				<AdminHeader title="Settings" />
				<AdminLightText text={`Error: ${error}`} />
			</div>
		);
	}

	if (!localOptions.length) {
		return (
			<div className="adminDeliverySettingsPageContainer">
				<AdminHeader title="Settings" />
				<AdminLightText text="No delivery settings available" />
			</div>
		);
	}

	return (
		<div className="adminDeliverySettingsPageContainer">
			<AdminHeader title="Settings" showBackButton />

			<div className="adminDeliverySettingsPageContent">
				<div className="adminDeliverySettingsPageInner">
					<AdminLightText
						text="Delivery Methods"
						textClassName="adminDeliverySettingsPageMarginBottom"
					/>

					{localOptions.map((opt) => (
						<div
							key={opt.documentId}
							className="adminDeliverySettingsPageDoubleInner"
						>
							<AdminInput
								inputContainerStyle={{ marginTop: 0 }}
								label="Name"
								value={opt.label}
								onChange={(e) =>
									updateOptionField(opt.documentId, "label", e.target.value)
								}
							/>

							<AdminInput
								label="Price"
								value={opt.price.toString()}
								onChange={(e) =>
									updateOptionField(opt.documentId, "price", e.target.value)
								}
							/>
						</div>
					))}
				</div>

				<div className="adminDeliverySettingsPageInner">
					<AdminInput
						inputContainerStyle={{ marginTop: 0 }}
						label="Tax Percentage"
						value={localTax}
						onChange={(e) => setLocalTax(e.target.value)}
					/>
				</div>

				<ButtonAdmin
					text={message || "Save Changes"}
					onClick={saveChangesHandler}
					styles={{ marginTop: "20px" }}
				/>
			</div>
		</div>
	);
};

export default AdminDeliverySettingsPage;
