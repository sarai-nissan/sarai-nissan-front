import AdminLightText from "../../../components/adminLightText/AdminLightText";
import "./adminActualEventLine.css";

type Props = {
	label: string;
	value?: string;
};

const AdminActualEventLine: React.FC<Props> = ({ label, value = "" }) => {
	return (
		<div className="adminActualEventLineContainer">
			<p className="adminActualEventText">{label}</p>
			<AdminLightText text={value} />
		</div>
	);
};

export default AdminActualEventLine;
