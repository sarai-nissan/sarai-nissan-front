import "./adminLightText.css";

type Props = {
	text: string;
	textClassName?: string;
};

const AdminLightText: React.FC<Props> = ({ text, textClassName }) => {
	return (
		<p className={["adminLightText", textClassName].filter(Boolean).join(" ")}>
			{text}
		</p>
	);
};

export default AdminLightText;
