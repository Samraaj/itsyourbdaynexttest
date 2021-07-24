import React, { useState } from "react";

import PhoneInput from "../forms/PhoneInput";
import VideoInput from "../forms/VideoInput";

// Actions
import { createReaction } from "../../lib/api";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";

const ResponseForm = ({ slug, onComplete, inModal = false }) => {
	const [celebratorFirstName, setCelebratorFirstName] = useState("Joanne");
	const [contact, setContact] = useState("");
	const [video, setVideo] = useState(null);
	const [uploading, setUploading] = useState(false);

	const classes = useStyles();

	const submit = () => {
		let reactionData = {
			contact: "+" + contact,
			video: video,
		};

		setUploading(true);

		createReaction(slug, reactionData).then((success) => {
			if (success) {
				setUploading(false);
				onComplete();
			}
		});
	};

	return (
		<Grid
			container
			className={classes.container}
			direction="column"
			justify="center"
			alignItems="center"
		>
			<Typography
				gutterBottom
				className={classes.bodyText}
				variant="body1"
				align="center"
			>
				We hope you enjoyed your video! We also make it easy to film a
				reaction. Take a quick 10-30 second video and we'll share it
				with all your friends who contributed!
			</Typography>
			<PhoneInput
				inModal={inModal}
				specialLabel="Your phone number"
				value={contact}
				onChange={(p) => setContact(p)}
				helperText="We'll text you when the montage is ready!"
			/>
			<VideoInput
				inModal={inModal}
				onChange={(v) => setVideo(v)}
				complete={video}
			/>
			{contact && video && (
				<Button
					variant="outlined"
					color="primary"
					startIcon={uploading ? null : <CakeOutlinedIcon />}
					onClick={submit}
					size="large"
				>
					{uploading ? "Uploading..." : "Submit"}
				</Button>
			)}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {},
	bodyText: {
		width: "90%",
		marginBottom: theme.spacing(4),
	},
	helper: {
		color: theme.palette.text.primary,
		width: "80%",
		textAlign: "center",
		textDecoration: "underline",
		cursor: "pointer",
	},
}));

export default ResponseForm;
