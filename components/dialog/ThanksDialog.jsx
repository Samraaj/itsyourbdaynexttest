import React from "react";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const ThanksDialog = ({ open, onClose }) => {
	return (
		<Dialog
			onClose={onClose}
			aria-labelledby="prompts-dialog-title"
			open={open}
		>
			<DialogTitle id="prompts-dialog-title">Thanks!</DialogTitle>
			<DialogContent>
				<Typography gutterBottom>
					Thanks for doing that, I'm sure everyone is going to love
					it. Happy birthday!
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Get me back to the video!
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ThanksDialog;
