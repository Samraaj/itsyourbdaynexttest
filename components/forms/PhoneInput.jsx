import React from "react";
import { makeStyles } from "@material-ui/core";

import ReactPhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/material.css";

const PhoneInput = ({ inModal = false, ...rest }) => {
	const classes = useStyles();
	return (
		<ReactPhoneInput
			inputClass={inModal ? classes.inputModal : classes.input}
			containerClass={
				inModal ? classes.containerModal : classes.container
			}
			country={"us"}
			{...rest}
		/>
	);
};

const useStyles = makeStyles((theme) => ({
	textField: {
		marginBottom: theme.spacing(2),
		width: "80%",
	},
	helperText: {
		color: theme.palette.text.primary,
	},
	input: {
		background: theme.palette.background.default + "!important",
		color: theme.palette.text.primary,
		width: "100%!important",
		"&:hover": {
			borderColor: "rgba(97, 84, 166, 1) !important",
		},
		"&:focus": {
			borderColor: "rgba(97, 84, 166, 1) !important",
			boxShadow: "0 0 0 0 !important",
			border: "2px solid rgba(97, 84, 166, 1) !important",
		},
	},
	container: {
		width: "80%",
		marginBottom: theme.spacing(2),
		"& .special-label": {
			background: theme.palette.background.default + "!important",
		},
	},
	inputModal: {
		color: theme.palette.text.primary,
		width: "100%!important",
		"&:hover": {
			borderColor: "rgba(97, 84, 166, 1) !important",
		},
		"&:focus": {
			borderColor: "rgba(97, 84, 166, 1) !important",
			boxShadow: "0 0 0 0 !important",
			border: "2px solid rgba(97, 84, 166, 1) !important",
		},
	},
	containerModal: {
		width: "90%",
		marginBottom: theme.spacing(2),
	},
}));

export default PhoneInput;
