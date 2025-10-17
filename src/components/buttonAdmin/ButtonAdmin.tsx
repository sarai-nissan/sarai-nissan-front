import "./buttonAdmin.css";

type Props = {
	text: string;
	onClick?: () => void;
	styles?: React.CSSProperties;
	disabled?: boolean;
	textStyle?: React.CSSProperties;
};

const ButtonAdmin: React.FC<Props> = ({
	text,
	onClick,
	styles,
	disabled,
	textStyle,
}) => {
	return (
		<button
			className="buttonAdminContainer"
			onClick={onClick}
			style={styles}
			disabled={disabled}
		>
			<p className="buttonAdminText" style={textStyle}>
				{text}
			</p>
		</button>
	);
};

export default ButtonAdmin;
