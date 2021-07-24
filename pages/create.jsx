import React, { useState } from "react";
import { useRouter } from "next/router";

// Actions
import { createUser, getAvailableSlug } from "../lib/api";

// Components
import Link from "next/link";
import Layout from "../components/layout";
import FormInput from "../components/forms/FormInput";
import PhoneInput from "../components/forms/PhoneInput";
import DateInput from "../components/forms/DateInput";
import Image from "next/image";

// Views
import Head from "next/head";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";
import { makeStyles } from "@material-ui/core/styles";

const Create = () => {
	// internal state
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [date, setDate] = useState(new Date());
	const [wisherName, setWisherName] = useState("");
	const [contact, setContact] = useState("");

	// router to redirect on complete
	const router = useRouter();
	const classes = useStyles();

	const submit = () => {
		// create bday object
		let bdayObj = {
			name: name,
			date: date,
			wisherName: wisherName,
			contact: "+" + contact,
		};

		createUser(bdayObj).then((slug) => {
			router.push("/" + slug + "/welcome");
		});
	};

	const handleNameChange = (e) => {
		setName(e.target.value);

		getAvailableSlug(e.target.value).then((slug) => {
			setSlug(slug);
		});
	};

	return (
		<React.Fragment>
			<Head>
				<title>Create a birthday celebration</title>
			</Head>
			<Layout>
				<Grid
					container
					className={classes.container}
					direction="column"
					justify="center"
					alignItems="center"
				>
					<Image
						className={classes.img}
						height={75}
						width={75}
						src="/images/logo.png"
					/>
					<Typography gutterBottom variant="h6">
						Create a Birthday Montage!
					</Typography>
					<Typography
						gutterBottom
						className={classes.bodyText}
						variant="body1"
						align="center"
					>
						We'll give you a link to send to the special someone's
						friends where they can record 10-30 second videos. They
						will automatically compile in to a montage!
					</Typography>
					<FormInput
						label="Whose birthday is it?"
						value={name}
						onChange={handleNameChange}
						helperText={
							slug
								? "Your unique link will be itsyourbday.co/" +
								  slug
								: ""
						}
					/>
					<DateInput
						label="Birthday date"
						value={date}
						onChange={(d) => setDate(d)}
					/>
					<FormInput
						label="YOUR name"
						value={wisherName}
						onChange={(e) => setWisherName(e.target.value)}
					/>
					<PhoneInput
						value={contact}
						onChange={(p) => setContact(p)}
						specialLabel="YOUR phone number"
					/>
					<Button
						variant="contained"
						color="primary"
						startIcon={<CakeOutlinedIcon />}
						onClick={submit}
						size="large"
					>
						Create
					</Button>
					<Link href="/">
						<a className={classes.helper}>How does it work?</a>
					</Link>
				</Grid>
			</Layout>
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: "5%",
		marginBottom: "5%",
	},
	img: {
		height: 75,
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2),
	},
	bodyText: {
		width: "80%",
		marginBottom: theme.spacing(2),
	},
	helper: {
		color: theme.palette.text.primary,
		width: "100%",
		textAlign: "center",
		// paddingLeft: theme.spacing(2),
		paddingTop: theme.spacing(2),
		textDecoration: "underline",
		cursor: "pointer",
	},
}));

export default Create;
