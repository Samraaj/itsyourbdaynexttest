import React from "react";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const PromptDialog = ({ open, onClose }) => {
	return (
		<Dialog
			onClose={onClose}
			aria-labelledby="prompts-dialog-title"
			open={open}
		>
			<DialogTitle id="prompts-dialog-title">
				How to make an amazing video
			</DialogTitle>
			<DialogContent>
				<Typography gutterBottom>
					Here are some ideas of what to talk about:
				</Typography>
				<Typography gutterBottom>
					<ul>
						<li>Your favorite memory with the birthday person.</li>
						<li>
							An embarassing fact about them - but be careful!
							Everyone is going to see this :).
						</li>
						<li>Something you admire about the birthday person.</li>
						<li>Maybe even share an inside joke!</li>
					</ul>
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Got it
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PromptDialog;
