import React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const Footer = () => {
	const classes = useStyles();

	return (
		<Grid
			container
			className={classes.container}
			justify="flex-start"
			alignItems="center"
			direction="column"
		>
			<Button
				className={classes.cta}
				variant="contained"
				color="primary"
				size="large"
				href="/create"
			>
				Start a Video
			</Button>
			<Button href="mailto:itsyourbdayco@gmail.com">
				Get in contact
			</Button>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		margin: "auto",
		width: "100vw",
		backgroundColor: "#FFC5C2",
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
	},
	header: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(4),
	},
	cta: {
		marginBottom: theme.spacing(4),
		marginTop: theme.spacing(4),
		width: 250,
		height: 60,
		fontSize: 24,
	},
}));

export default Footer;
