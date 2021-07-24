import React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const Header = () => {
	const classes = useStyles();

	return (
		<Grid container className={classes.container} justify="center">
			<Grid
				lg={4}
				xs={12}
				item
				container
				direction="column"
				justify="center"
				alignItems="center"
				className={classes.left}
			>
				<img
					className={classes.logo}
					src="/images/logo.png"
					alt="logo"
				/>
				<Typography align="center" variant="h3" gutterBottom>
					it's your bday
				</Typography>
				<Typography align="center" variant="h5" gutterBottom>
					Surprise your loved ones with a beautiful video montage
				</Typography>
				<Button
					className={classes.cta}
					variant="contained"
					color="primary"
					size="large"
					href="create"
				>
					Start a Video
				</Button>
			</Grid>
			<Grid
				lg={4}
				xs={12}
				item
				container
				justify="center"
				alignItems="center"
				className={classes.right}
			>
				{/* <img className={classes.img} src={herogif} /> */}
				<video
					height="500"
					autoPlay
					playsInline
					muted
					loop
					src="/videos/herovideo.mp4"
					type="video/mp4"
				></video>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		margin: "auto",
		marginTop: "10vh",
		marginBottom: "10vh",
		// height: "80vh",
	},
	left: {
		paddingLeft: "5%",
		paddingRight: "5%",
	},
	right: {},
	img: {
		maxHeight: "60vh",
		maxWidth: "90vw",
	},
	logo: {
		height: 50,
	},
	cta: {
		marginBottom: theme.spacing(4),
		marginTop: theme.spacing(2),
		width: 250,
		height: 60,
		fontSize: 24,
	},
}));

export default Header;
