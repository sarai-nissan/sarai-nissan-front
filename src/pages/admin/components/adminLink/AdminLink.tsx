import AdminLightText from "../adminLightText/AdminLightText";
import "./adminLink.css";

type Props = {
	text: string;
	onPress: () => void;
};

const AdminLink: React.FC<Props> = ({ text, onPress }) => {
	return (
		<div className="adminLinkContainer" onClick={onPress}>
			<AdminLightText text={text} />
			<div className="adminLinkArrowContainer">
				<div className="adminLinkArrowLine" />
				<div className="adminLinkArrowLine" />
			</div>
		</div>
	);
};

export default AdminLink;
