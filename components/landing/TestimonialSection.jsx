import React from "react";

import Testimonial from "./Testimonial";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const TestimonialSection = () => {
	const classes = useStyles();

	const text1 =
		'"I was absolutely floored by the video I was given! It was so special to see all of my family and friends showing me how much I mean to them. Unbelievable gift, and I am so happy to have recieved it. "';
	const author1 = "Kevin";

	const text2 =
		'"It was so simple to use itsyourbday! It took me a total of 2 minutes to contribute to the birthday wish, and I even chipped in $5 to pay for a bottle for my friend."';
	const author2 = "Sharan";

	return (
		<Grid
			container
			className={classes.container}
			justify="flex-start"
			alignItems="center"
			direction="column"
		>
			<Typography
				className={classes.header}
				align="center"
				variant="h3"
				gutterBottom
			>
				What Others are Saying
			</Typography>
			<Grid item container justify="center">
				<Testimonial text={text1} author={author1} />
				<Testimonial text={text2} author={author2} />
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		margin: "auto",
		width: "100vw",
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
	},
	header: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(4),
	},
}));

export default TestimonialSection;
