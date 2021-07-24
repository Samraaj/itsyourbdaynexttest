import React from "react";

// components
import HowItWorksEntry from "./HowItWorksEntry";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const HowItWorks = () => {
	const classes = useStyles();

	// const img1 = "https://placekitten.com/250/300";
	const img1 = "/images/createcelebration.png";
	const title1 = "Create celebration";
	const text1 =
		"Get a contribution link to distribute to the special someone's family and friends.";
	const img2 = "/images/videorecord.png";
	const title2 = "Collect videos";
	const text2 =
		"Each friend records a short birthday wish that is automatically edited into a montage by our system.";
	const img3 = "/images/watchvideo.png";
	const title3 = "Send and celebrate!";
	const text3 =
		"Once all of the videos are compiled, the video link is sent to your friend to enjoy!";

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
				How it works
			</Typography>
			<Grid item container justify="space-around">
				<HowItWorksEntry img={img1} title={title1} text={text1} />
				<HowItWorksEntry img={img2} title={title2} text={text2} />
				<HowItWorksEntry img={img3} title={title3} text={text3} />
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		margin: "auto",
		backgroundColor: "#FFC5C2",
		width: "100vw",
	},
	img: {
		height: 500,
	},
	header: {
		marginTop: theme.spacing(4),
	},
}));

export default HowItWorks;
