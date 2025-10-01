import React from "react";
import "./input.css";

interface InputProps {
	label?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	name?: string;
	inputContainerStyle?: React.CSSProperties;
	inputStyle?: React.CSSProperties;
	autoFocus?: boolean;
}

const Input: React.FC<InputProps> = ({
	label,
	value,
	onChange,
	type,
	name,
	inputContainerStyle,
	inputStyle,
	autoFocus,
}) => {
	return (
		<div className="inputContainer" style={inputContainerStyle}>
			{label && <p className="inputLabel">{label}</p>}
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				className="inputField"
				style={inputStyle}
				autoFocus={autoFocus}
			/>
		</div>
	);
};

export default Input;
