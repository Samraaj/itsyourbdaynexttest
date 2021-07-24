import React from "react";
import { useRouter } from "next/router";

// Actions
import { getBirthdayInfo } from "../../../controllers/UserController";

// Components
import Image from "next/image";
import Layout from "../../../components/layout";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

// components
import BuyABottle from "../../../components/payment/BuyABottle";

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

const ThankYou = ({ celebratorFirstName }) => {
	const router = useRouter();
	const { slug, wishId } = router.query;

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
				<Typography gutterBottom variant="h6">
					Thank you!
				</Typography>
				<Typography
					gutterBottom
					className={classes.bodyText}
					variant="body1"
					align="center"
				>
					{celebratorFirstName} is going to love the message! We'll
					send you text when the completed video is ready to watch.
				</Typography>
				<Divider variant="middle" />
				{slug == "kulmeet" && (
					<BuyABottle
						celebratorFirstName={celebratorFirstName}
						wishId={wishId}
					/>
				)}
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

export default ThankYou;
