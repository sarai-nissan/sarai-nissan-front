import "./adminPageLink.css";

type Props = {
	text: string;
	onPress: () => void;
};

const AdminPageLink: React.FC<Props> = ({ text, onPress }) => {
	return (
		<div className="adminLinkContainer" onClick={onPress}>
			<p className="adminLinkText">{text}</p>
			<div className="adminLinkArrowContainer">
				<div className="adminLinkArrowLine" />
				<div className="adminLinkArrowLine" />
			</div>
		</div>
	);
};

export default AdminPageLink;
