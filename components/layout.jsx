import React from "react";
import Head from "next/head";

// Material components
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const Layout = ({ children }) => {
	const classes = useStyles();

	return (
		<Grid
			className={classes.container}
			item
			container
			xs={12}
			md={8}
			lg={6}
			justify="center"
		>
			<main>{children}</main>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		margin: "auto",
	},
}));

export default Layout;
