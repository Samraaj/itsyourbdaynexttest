import React from "react";
import Confetti from "react-confetti";

// components
import Header from "../components/landing/Header";
import HowItWorks from "../components/landing/HowItWorks";
import TestimonialSection from "../components/landing/TestimonialSection";
import Footer from "../components/landing/Footer";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const Landing = () => {
	const classes = useStyles();

	return (
		<Grid
			item
			container
			className={classes.container}
			direction="column"
			justify="flex-start"
			alignItems="center"
			xs={12}
			md={12}
			lg={12}
		>
			<Header />
			<HowItWorks />
			<TestimonialSection />
			<Footer />
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		margin: "auto",
	},
	light: {
		backgroundColor: theme.palette.background.default,
	},
	dark: {
		backgroundColor: "#FFC5C2",
	},
}));

export default Landing;
