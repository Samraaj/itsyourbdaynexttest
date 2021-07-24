import React, { useState } from "react";

import ResponseForm from "../response/ResponseForm";
import LaterForm from "../response/LaterForm";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const ResponseDialog = ({ open, onClose, onComplete, slug }) => {
	const [later, setLater] = useState(false);

	return (
		<Dialog
			onClose={onClose}
			aria-labelledby="prompts-dialog-title"
			open={open}
		>
			<DialogTitle id="prompts-dialog-title">
				{later ? "Film later?" : "Film a response video?"}
			</DialogTitle>
			<DialogContent>
				{later ? (
					<LaterForm slug={slug} onComplete={onComplete} />
				) : (
					<ResponseForm
						inModal={true}
						slug={slug}
						onComplete={onComplete}
					/>
				)}
			</DialogContent>
			<DialogActions>
				{later ? (
					<Button onClick={onClose} color="primary">
						No thanks
					</Button>
				) : (
					<Button onClick={() => setLater(true)} color="primary">
						Can I do this later?
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default ResponseDialog;
