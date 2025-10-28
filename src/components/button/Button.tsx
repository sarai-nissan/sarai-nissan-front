import "./button.css";

type Props = {
	text: string;
	onClick?: () => void;
	disabled?: boolean;
	styles?: React.CSSProperties;
	buttonClassName?: string;
	textStyle?: React.CSSProperties;
};

const Button: React.FC<Props> = ({
	text,
	onClick,
	disabled,
	styles,
	buttonClassName,
	textStyle,
}) => {
	return (
		<button
			className={`buttonContainer ${buttonClassName}`}
			style={styles}
			disabled={disabled}
			onClick={onClick}
		>
			<p className="buttonText" style={textStyle}>
				{text}
			</p>
		</button>
	);
};

export default Button;
