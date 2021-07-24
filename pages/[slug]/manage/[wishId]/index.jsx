import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Actions
import {
	sendCelebrationTexts,
	publishCelebration,
	unPublishCelebration,
	deleteWish,
	reorderWish,
} from "../../../../lib/api";
import { getBirthdayInfo } from "../../../../controllers/UserController";
import { getWishes } from "../../../../controllers/WishController";

// components
import WishAdminEntry from "../../../../components/admin/WishAdminEntry";
import FinalizeSection from "../../../../components/admin/FinalizeSection";
import Head from "next/head";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { makeStyles } from "@material-ui/core/styles";

// Server-side data injection
export async function getServerSideProps(context) {
	// Get the celebration details to load the user name and Celebration ID
	let { name, published, textsSent, mainWishId } = await getBirthdayInfo(
		context.params.slug
	);

	if (mainWishId != context.params.wishId) {
		return {
			redirect: {
				permanent: false,
				destination: "/" + context.params.slug + "/sign",
			},
		};
	}

	// Get all wishes
	let wishes = await getWishes(context.params.slug);

	return {
		props: {
			celebratorFirstName: name.split(" ")[0],
			publishedServer: published,
			textsSentServer: textsSent,
			wishes: JSON.parse(JSON.stringify(wishes)),
		},
	};
}

const Manage = ({
	celebratorFirstName,
	wishes,
	publishedServer,
	textsSentServer,
}) => {
	const router = useRouter();
	const { slug, wishId } = router.query;

	// state
	const [published, setPublished] = useState(publishedServer);
	const [textsSent, setTextsSent] = useState(textsSentServer);

	const classes = useStyles();

	const onPublishClick = () => {
		if (published) {
			setPublished(false);
			unPublishCelebration(slug).then((success) => {
				if (success) {
					setPublished(false);
				}
			});
		} else {
			setPublished(true);
			publishCelebration(slug).then((success) => {
				if (success) {
					setPublished(true);
				}
			});
		}
	};

	// Handler for sending result texts
	const onSendTexts = () => {
		setTextsSent(true);

		sendCelebrationTexts(slug).then((success) => {
			if (success) {
				setTextsSent(true);
			}
		});
	};

	const onDelete = (wishId) => {
		deleteWish(wishId).then((success) => {
			if (success) {
				// refresh page to remount
				window.location.reload();
			}
		});
	};

	const onReorder = (wishId, position) => {
		console.log(wishId + " to be re ordered to " + position);
		reorderWish(wishId, position).then((success) => {
			if (success) {
				// refresh page to remount
				window.location.reload();
			}
		});
	};

	return (
		<React.Fragment>
			<Head>
				<title>
					Manage {celebratorFirstName || slug}'s celebration
				</title>
			</Head>
			<Grid container className={classes.container} justify="center">
				<Grid item xs={12} className={classes.header}>
					<Typography variant="h4">
						{celebratorFirstName || slug}'s Birthday
					</Typography>
					<Button href={"/" + slug + "/preview"}>
						Preview result
					</Button>
				</Grid>
				<Divider variant="middle" />
				<Grid item xs={12} className={classes.header}>
					<Typography variant="h5">Finalize Video</Typography>
				</Grid>
				<FinalizeSection
					published={published}
					textsSent={textsSent}
					onPublish={onPublishClick}
					onSendTexts={onSendTexts}
				/>
				<Grid item xs={12} className={classes.header}>
					<Typography variant="h5">All Wishes</Typography>
				</Grid>
				{wishes.map((wish, index) => (
					<WishAdminEntry
						key={wish._id}
						wish={wish}
						onDelete={onDelete}
						onReorder={onReorder}
						position={index}
						numWishes={wishes.length}
					/>
				))}
				<Link href={"/" + slug + "/manage/" + wishId + "/deleted"}>
					<a>
						<Button
							variant="contained"
							size="large"
							color="primary"
							endIcon={<ChevronRightIcon />}
						>
							Deleted Videos
						</Button>
					</a>
				</Link>
			</Grid>
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
	},
	header: {
		marginBottom: theme.spacing(2),
	},
}));

export default Manage;
