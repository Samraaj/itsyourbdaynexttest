import React from "react";
import { useRouter } from "next/router";

// Actions
import { getBirthdayInfo } from "../../controllers/UserController";

// Components
import Image from "next/image";
import Layout from "../../components/layout";
import CopyableLink from "../../components/links/CopyableLink";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// Server-side data injection
export async function getServerSideProps(context) {
	// Get the celebration details to load the user name and Celebration ID
	let { name } = await getBirthdayInfo(context.params.slug);

	return {
		props: {
			celebratorFirstName: name.split(" ")[0],
		},
	};
}

const Welcome = ({ celebratorFirstName }) => {
	const router = useRouter();
	const { slug } = router.query;
	const classes = useStyles();

	return (
		<Layout>
			<Grid
				container
				className={classes.container}
				direction="column"
				justify="center"
				alignItems="center"
			>
				<Image
					className={classes.img}
					height={75}
					width={75}
					src="/images/logo.png"
				/>
				<Typography gutterBottom variant="h5">
					You're a rockstar for this!
				</Typography>
				<Typography
					className={classes.bodyText}
					variant="body1"
					align="center"
				>
					{celebratorFirstName} will love the message. Share the
					following link with their friends so they can each record a
					short video!
				</Typography>
				<CopyableLink path={slug + "/sign"} />
				<Typography
					gutterBottom
					className={classes.bodyText}
					variant="body1"
					align="center"
				>
					We sent you this link through text as well, along with a
					link to manage & publish the video!
				</Typography>
			</Grid>
		</Layout>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: "5%",
		marginBottom: "5%",
	},
	img: {
		height: 75,
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2),
	},
	bodyText: {
		width: "80%",
		marginBottom: theme.spacing(2),
	},
}));

export default Welcome;
