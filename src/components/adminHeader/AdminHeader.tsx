import { useNavigate } from "react-router-dom";
import "./adminHeader.css";

type Props = {
	title: string;
};

const AdminHeader: React.FC<Props> = ({ title }) => {
	const navigation = useNavigate();

	const backHandler = () => navigation(-1);

	return (
		<div className="adminHeaderContainer">
			<div className="adminHeaderBackContainer" onClick={backHandler}>
				<div className="adminHeaderBackLine" />
				<div className="adminHeaderBackLine" />
			</div>
			<p>{title}</p>
			<div className="adminHeaderEmpty" />
		</div>
	);
};

export default AdminHeader;
