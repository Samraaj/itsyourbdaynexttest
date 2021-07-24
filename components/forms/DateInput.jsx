import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core";

const DateInput = ({ ...rest }) => {
	const classes = useStyles();
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<DatePicker
				inputVariant="outlined"
				className={classes.textField}
				FormHelperTextProps={{ className: classes.helperText }}
				{...rest}
			/>
		</MuiPickersUtilsProvider>
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

export default DateInput;
