import React from "react";
import NumberFormat from "react-number-format";

const PhoneFormatBase = (props) => {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			format="+1 (###) ###-####"
			mask="_"
			isNumericString
		/>
	);
};

export default PhoneFormatBase;
