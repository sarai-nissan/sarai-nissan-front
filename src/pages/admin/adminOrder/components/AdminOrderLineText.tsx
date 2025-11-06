import AdminLightText from "../../components/adminLightText/AdminLightText";
import "./adminOrderLineText.css";

type Props = {
	label: string;
	value?: string;
};

const AdminOrderLineText: React.FC<Props> = ({ label, value = "" }) => {
	return (
		<div className="adminOrderLineTextContainer">
			<AdminLightText text={`${label}:`} />
			<p className="adminOrderLineRegularText">{value}</p>
		</div>
	);
};

export default AdminOrderLineText;
