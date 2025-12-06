import "./adminInput.css";

type Props = {
	label?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	name?: string;
	inputContainerStyle?: React.CSSProperties;
	inputStyle?: React.CSSProperties;
	autoFocus?: boolean;
	placeholder?: string;
};

const AdminInput: React.FC<Props> = ({
	label,
	value,
	onChange,
	type,
	name,
	inputContainerStyle,
	inputStyle,
	autoFocus,
	placeholder,
}) => {
	return (
		<div className="adminInputContainer" style={inputContainerStyle}>
			{label && <p className="adminInputLabel">{label}</p>}
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				className="adminInputField"
				style={inputStyle}
				autoFocus={autoFocus}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default AdminInput;
