import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";

const WishAdminEntry = ({ wish, onDelete, onReorder, position, numWishes }) => {
	const classes = useStyles();

	const handleDelete = () => {
		onDelete(wish._id);
	};

	const handleReorder = (e) => {
		onReorder(wish._id, e.target.value);
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
			<Button variant="outlined" onClick={handleDelete}>
				Delete
			</Button>
			<InputLabel htmlFor="position-select">Reorder</InputLabel>
			<Select
				native
				value={position}
				onChange={handleReorder}
				inputProps={{
					name: "position",
					id: "position-select",
				}}
			>
				{[...Array(numWishes - 1).keys()].map((index) => (
					<option key={index + 1} value={index + 1}>
						{index + 1}
					</option>
				))}
			</Select>
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

export default WishAdminEntry;
