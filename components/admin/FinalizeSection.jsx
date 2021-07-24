import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const FinalizeSection = ({ published, textsSent, onPublish, onSendTexts }) => {
	const classes = useStyles();

	return (
		<Grid item xs={12}>
			<Typography gutterBottom variant="body1" className={classes.margin}>
				Publishing a video will close submissions and send you the
				result link. You can revert the publish if you want to collect
				more videos!
			</Typography>
			<Button
				variant="contained"
				color={published ? "secondary" : "primary"}
				onClick={onPublish}
				size="large"
				className={classes.margin}
			>
				{published ? "Revert" : "Publish"}
			</Button>
			{published && (
				<React.Fragment>
					<Typography
						gutterBottom
						variant="body1"
						className={classes.margin}
					>
						Now that the video is published, you can notify everyone
						who contributed with the following button. You can only
						do this once!
					</Typography>
					<Button
						variant="contained"
						color="primary"
						onClick={onSendTexts}
						size="large"
						disabled={textsSent}
						className={classes.margin}
					>
						{textsSent ? "Sent" : "Send texts"}
					</Button>
				</React.Fragment>
			)}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	margin: {
		marginBottom: theme.spacing(2),
	},
}));

export default FinalizeSection;
