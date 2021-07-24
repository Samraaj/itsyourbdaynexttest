import React, { useState } from "react";

// Controller
import { getReaction } from "../../controllers/CelebrationController";

// Components
import Image from "next/image";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

export async function getServerSideProps(context) {
	let reaction = await getReaction(context.params.slug);

	if (!reaction) {
		return {
			redirect: {
				permanent: false,
				destination: "/" + context.params.slug,
			},
		};
	}

	return {
		props: {
			reaction: reaction,
		},
	};
}

const ReactionVideo = ({ reaction }) => {
	const classes = useStyles();

	return (
		<Grid
			container
			className={classes.container}
			direction="column"
			justify="center"
			alignItems="center"
		>
			<Image height={120} width={1000} src="/images/textlogo.svg" />
			<video
				className={classes.video}
				controls
				src={reaction}
				type="video/mp4"
			></video>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	img: {
		// width: "100%",
		height: 75,
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2),
	},
	container: {
		marginTop: "5%",
		marginBottom: "5%",
	},
	video: {},
	slider: {},
}));

export default ReactionVideo;
