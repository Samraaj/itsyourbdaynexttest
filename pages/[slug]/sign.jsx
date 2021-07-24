import React, { useState } from "react";
import { useRouter } from "next/router";

// Actions
import { createWish } from "../../lib/api";

// Controller
import { getBirthdayInfo } from "../../controllers/UserController";

// Components
import Image from "next/image";
import Head from "next/head";
import Layout from "../../components/layout";
import FormInput from "../../components/forms/FormInput";
import PhoneInput from "../../components/forms/PhoneInput";
import VideoInput from "../../components/forms/VideoInput";
import PromptDialog from "../../components/dialog/PromptDialog";

// View
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";
import { makeStyles } from "@material-ui/core/styles";

// Server-side data injection
export async function getServerSideProps(context) {
	// Get the celebration details to load the user name and Celebration ID
	let { name, celebrationId, published } = await getBirthdayInfo(
		context.params.slug
	);

	if (published) {
		return {
			redirect: {
				permanent: false,
				destination: "/" + context.params.slug,
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
		props: {
			celebratorFirstName: name.split(" ")[0],
			celebrationId: celebrationId.toString(),
		},
	};
}

const Sign = ({ celebratorFirstName, celebrationId }) => {
	const router = useRouter();
	const { slug } = router.query;
	const classes = useStyles();

	// State
	const [name, setName] = useState("");
	const [contact, setContact] = useState("");
	const [video, setVideo] = useState(null);
	const [duration, setDuration] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const submit = () => {
		// create bday object
		let wishObj = {
			name: name,
			contact: "+" + contact,
			video: video,
			duration: duration,
			celebrationId: celebrationId,
		};

		setUploading(true);

		createWish(wishObj).then((wish) => {
			router.push("/" + slug + "/thankyou/" + wish._id);
		});
	};

	// Calculates the duration of the video and sets the proper states
	const onVideoUpload = (v) => {
		let vidElement = document.createElement("video");
		let fileURL = URL.createObjectURL(v);

		vidElement.src = fileURL;

		vidElement.ondurationchange = () => {
			setDuration(vidElement.duration);
		};

		setVideo(v);
	};

	const helperClick = () => {
		setDialogOpen(true);
	};

	return (
		<React.Fragment>
			<Head>
				<title>Wish {celebratorFirstName} Happy Birthday</title>
			</Head>
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
						Wish {celebratorFirstName || slug} a Happy Birthday!
					</Typography>
					<Typography
						gutterBottom
						className={classes.bodyText}
						variant="body1"
						align="center"
					>
						We're making a video montage for {celebratorFirstName}'s
						birthday. Take a 10-30 second video to be included!
					</Typography>
					<FormInput
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<PhoneInput
						label="Phone number"
						value={contact}
						onChange={(p) => setContact(p)}
						helperText="We'll text you when the montage is ready!"
					/>
					<VideoInput onChange={onVideoUpload} complete={video} />
					{!video && (
						<a
							className={classes.helper}
							variant="subtitle1"
							align="left"
							onClick={helperClick}
						>
							Don't know what to say?
						</a>
					)}

					<PromptDialog
						open={dialogOpen}
						onClose={() => setDialogOpen(false)}
					/>
					{name && contact && video && (
						<Button
							variant="contained"
							color="primary"
							startIcon={uploading ? null : <CakeOutlinedIcon />}
							onClick={submit}
							size="large"
						>
							{uploading ? "Uploading..." : "Submit"}
						</Button>
					)}
				</Grid>
			</Layout>
		</React.Fragment>
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
	helper: {
		color: theme.palette.text.primary,
		width: "80%",
		textAlign: "center",
		textDecoration: "underline",
		cursor: "pointer",
	},
}));

export default Sign;
