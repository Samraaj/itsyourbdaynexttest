import React from "react";
import { makeStyles, TextField } from "@material-ui/core";

const FormInput = ({ ...rest }) => {
	const classes = useStyles();
	return (
		<TextField
			className={classes.textField}
			variant="outlined"
			FormHelperTextProps={{ className: classes.helperText }}
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
}));

export default FormInput;
