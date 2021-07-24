import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const HowItWorksEntry = ({ img, title, text }) => {
	const classes = useStyles();

	return (
		<Grid
			item
			container
			xs={12}
			md={4}
			lg={4}
			className={classes.container}
			justify="flex-start"
			alignItems="center"
			direction="column"
		>
			<img
				className={classes.img}
				src={img}
				alt="how it works illustration"
			/>
			<Typography
				className={classes.title}
				align="center"
				variant="h5"
				gutterBottom
			>
				{title}
			</Typography>
			<Typography
				className={classes.text}
				align="center"
				variant="body1"
				gutterBottom
			>
				{text}
			</Typography>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: { padding: "5%" },
	title: {
		fontWeight: 550,
	},
	text: {},
	right: {},
	img: {
		height: 200,
		marginBottom: theme.spacing(2),
	},
}));

export default HowItWorksEntry;
