import React from "react";
import "./inputDropDown.css";

interface InputDropDownProps {
	label?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	optionValues: string[];
	countryNames: { [key: string]: string };
}

const InputDropDown: React.FC<InputDropDownProps> = ({
	label,
	value,
	onChange,
	optionValues,
	countryNames,
}) => {
	return (
		<div className="inputDdContainer">
			{label && <p className="inputDdLabel">{label}</p>}
			<select
				id="country"
				name="country"
				value={value}
				onChange={onChange}
				className="inputDdInput"
			>
				<option value="" disabled>
					Select a country
				</option>
				{optionValues.map((code) => (
					<option key={code} value={code}>
						{countryNames[code]}
					</option>
				))}
			</select>
		</div>
	);
};

export default InputDropDown;
