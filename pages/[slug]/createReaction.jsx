import React, { useState } from "react";
import { useRouter } from "next/router";

// Controller
import { getBirthdayInfo } from "../../controllers/UserController";

// components
import Layout from "../../components/layout";
import Image from "next/image";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ResponseForm from "../../components/response/ResponseForm";
import ThanksDialog from "../../components/dialog/ThanksDialog";

// Server-side data injection
export async function getServerSideProps(context) {
	// Get the celebration details to load the user name and Celebration ID
	let { celebrationId, published } = await getBirthdayInfo(
		context.params.slug
	);

	if (!published) {
		return {
			redirect: {
				permanent: false,
				destination: "/" + context.params.slug + "/sign",
			},
		};
	}

	// redirect if celebration doesn't exist
	if (!celebrationId) {
		return {
			redirect: {
				permanent: false,
				destination: "/create",
			},
		};
	}

	return {
		props: {},
	};
}

const CreateReaction = ({}) => {
	const [open, setOpen] = useState(false);

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
				<Typography gutterBottom variant="h6">
					Share your reaction
				</Typography>
				<ResponseForm
					slug={slug}
					onComplete={() => setOpen(true)}
					inModal={false}
				/>
				<ThanksDialog
					open={open}
					onClose={() => router.push("/" + slug)}
				/>
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

export default CreateReaction;
