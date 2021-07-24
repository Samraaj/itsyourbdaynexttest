import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const DeletedWishEntry = ({ wish, onRestore }) => {
	const classes = useStyles();

	const handleRestore = () => {
		onRestore(wish._id);
	};

	return wish.video ? (
		<Grid item xs={12} className={classes.entry}>
			<Typography gutterBottom variant="h6">
				{wish.name}
			</Typography>
			<video height="300" controls>
				<source src={wish.video} type="video/mp4" />
			</video>
			<br />
			<Button variant="outlined" onClick={handleRestore}>
				Restore
			</Button>
		</Grid>
	) : null;
};

const useStyles = makeStyles((theme) => ({
	entry: {
		paddingBottom: theme.spacing(1),
		marginTop: theme.spacing(1),
		borderBottom: "1px solid " + theme.palette.text.primary,
	},
}));

export default DeletedWishEntry;
