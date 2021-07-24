import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const Testimonial = ({ text, author, img }) => {
	const classes = useStyles();

	return (
		<Grid
			item
			xs={12}
			md={4}
			lg={4}
			className={classes.container}
			align="center"
		>
			<Paper elevation={3} className={classes.paper}>
				<Avatar className={classes.avatar} src={img} />
				<Typography
					className={classes.title}
					align="center"
					variant="body1"
					gutterBottom
				>
					{text}
				</Typography>
				<Typography align="right" variant="body2" gutterBottom>
					- {author}
				</Typography>
			</Paper>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		margin: "auto",
		width: "100vw",
	},
	paper: {
		width: "80%",
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	avatar: {
		width: theme.spacing(4),
		height: theme.spacing(4),
		marginBottom: theme.spacing(1),
	},
}));

export default Testimonial;
