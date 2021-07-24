import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { isMobile } from "react-device-detect";
import Tooltip from "@material-ui/core/Tooltip";
import VideocamIcon from "@material-ui/icons/Videocam";

const VideoInput = ({ onChange, complete, inModal = false }) => {
	const classes = useStyles();

	const handleChange = (e) => {
		onChange(e.target.files[0]);
	};

	return (
		<React.Fragment>
			<Tooltip
				title={
					!isMobile &&
					"This is even easier when opening this page on mobile!"
				}
				placement="top"
			>
				<Button
					variant="outlined"
					color="secondary"
					className={inModal ? classes.inputModal : classes.input}
					onClick={() =>
						document.getElementById("video-upload-input").click()
					}
					disabled={Boolean(complete)}
					startIcon={<VideocamIcon />}
				>
					{complete ? "Complete" : "Record Video"}
				</Button>
			</Tooltip>
			<input
				id="video-upload-input"
				className={classes.nativeInput}
				type="file"
				accept="video/*"
				name="video"
				onChange={handleChange}
			/>
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	input: {
		marginBottom: theme.spacing(2),
		width: "80%",
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	inputModal: {
		marginBottom: theme.spacing(2),
		width: "90%",
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	nativeInput: {
		display: "none",
	},
}));

export default VideoInput;
