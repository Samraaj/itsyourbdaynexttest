import React, { useState } from "react";

import PhoneInput from "../forms/PhoneInput";
import { createReactionLater } from "../../lib/api";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";

const LaterForm = ({ slug, onComplete }) => {
	const [contact, setContact] = useState("");

	const classes = useStyles();

	const submit = () => {
		createReactionLater(slug, "+" + contact).then((data) => {
			onComplete();
		});
	};

	return (
		<Grid
			container
			className={classes.container}
			direction="column"
			justify="center"
			alignItems="center"
		>
			<Typography
				gutterBottom
				className={classes.bodyText}
				variant="body1"
				align="center"
			>
				Leave us your phone number and we'll text you a direct link to
				film :)
			</Typography>
			<PhoneInput
				inModal={true}
				specialLabel="Your phone number"
				value={contact}
				onChange={(p) => setContact(p)}
				helperText="We'll text you when the montage is ready!"
			/>
			<Button
				variant="outlined"
				color="primary"
				startIcon={<CakeOutlinedIcon />}
				onClick={submit}
				size="large"
			>
				Submit
			</Button>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {},
	bodyText: {
		width: "90%",
		marginBottom: theme.spacing(4),
	},
	helper: {
		color: theme.palette.text.primary,
		width: "80%",
		textAlign: "center",
		textDecoration: "underline",
		cursor: "pointer",
	},
}));

export default LaterForm;
