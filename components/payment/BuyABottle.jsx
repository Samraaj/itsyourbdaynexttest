import React, { useState } from "react";

// Components
import Checkout from "../forms/stripe/Checkout";

// Actions
import { contributionClicked, setContribution } from "../../lib/api";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

const BuyABottle = ({ celebratorFirstName, wishId }) => {
	const [clicked, setClicked] = useState(false);
	const [amount, setAmount] = useState(1);
	const [succeeded, setSucceeded] = useState(false);

	const classes = useStyles();

	const onClick = () => {
		setClicked(true);
		// for data tracking purposes, update the back end that the user has clicked the contribute button
		contributionClicked(wishId, (success) => {
			success
				? console.log("Logged contribution clicked")
				: console.log("Logging contribution failed");
		});
	};

	const onPaymentSuccessful = () => {
		setSucceeded(true);
		setContribution(wishId, amount * 5, (success) => {
			success
				? console.log("Contribution set")
				: console.log("Failed to set Contribution");
		});
	};

	return clicked ? (
		<React.Fragment>
			{!succeeded && (
				<React.Fragment>
					<Typography variant="h6" gutterBottom>
						How much would you like to contribute?
					</Typography>
					<Grid item>
						<Chip
							className={classes.chip}
							label="$5"
							color="secondary"
							variant={amount === 1 ? "default" : "outlined"}
							clickable
							onClick={() => setAmount(1)}
						/>
						<Chip
							className={classes.chip}
							label="$10"
							color="secondary"
							variant={amount === 2 ? "default" : "outlined"}
							clickable
							onClick={() => setAmount(2)}
						/>
						<Chip
							className={classes.chip}
							label="$15"
							color="secondary"
							variant="outlined"
							variant={amount === 3 ? "default" : "outlined"}
							clickable
							onClick={() => setAmount(3)}
						/>
					</Grid>
				</React.Fragment>
			)}
			<Grid item container align="center" justify="center">
				<Checkout
					amount={amount}
					onPaymentSuccessful={onPaymentSuccessful}
				/>
			</Grid>
		</React.Fragment>
	) : (
		<Grid
			item
			container
			className={classes.container}
			align="center"
			justify="center"
		>
			<Typography gutterBottom variant="h6">
				Pitch in for a mug?
			</Typography>
			<Typography
				gutterBottom
				className={classes.bodyText}
				variant="body1"
				align="center"
			>
				We're also buying {celebratorFirstName} this amazing mug! If you
				contribute, your name will be included with the gift :)
			</Typography>
			<Grid item xs={12}>
				<img
					className={classes.mug}
					src="https://i.imgur.com/Yie05IS.jpg"
					alt="Gift"
				/>
			</Grid>
			<Button
				variant="contained"
				color="primary"
				onClick={onClick}
				size="large"
			>
				Contribute $5
			</Button>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		marginBottom: theme.spacing(3),
		padding: theme.spacing(2),
		border: "1px solid " + theme.palette.text.primary,
		borderRadius: 10,
		width: "90%",
	},
	chip: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: theme.spacing(10),
	},
	bodyText: {
		width: "80%",
		marginBottom: theme.spacing(2),
	},
	mug: {
		marginBottom: theme.spacing(2),
		height: "30vh",
	},
}));

export default BuyABottle;
