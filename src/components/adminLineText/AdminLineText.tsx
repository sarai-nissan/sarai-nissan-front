import React from "react";
import "./adminLineText.css";

interface AdminLineTextProps {
	text: string;
	info: string;
}

const AdminLineText: React.FC<AdminLineTextProps> = ({ text, info }) => {
	return (
		<div className="adminLinesTextContainer">
			<p className="adminLinesTextExtraLightText">{text}:</p>
			<p className="adminLinesTextMediumText">{info}</p>
		</div>
	);
};

export default AdminLineText;
