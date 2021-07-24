import React from "react";
import { useRouter } from "next/router";

// Actions
import { getBirthdayInfo } from "../../../../controllers/UserController";
import { getDeletedWishes } from "../../../../controllers/WishController";

// Actions
import { restoreWish } from "../../../../lib/api";

import DeletedWishEntry from "../../../../components/admin/DeletedWishEntry";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// Server-side data injection
export async function getServerSideProps(context) {
	// Get the celebration details to load the user name and Celebration ID
	let { name, mainWishId } = await getBirthdayInfo(context.params.slug);

	if (mainWishId != context.params.wishId) {
		return {
			redirect: {
				permanent: false,
				destination: "/" + context.params.slug + "/sign",
			},
		};
	}

	// Get all wishes
	let deletedWishes = await getDeletedWishes(context.params.slug);

	return {
		props: {
			celebratorFirstName: name.split(" ")[0],
			deletedWishes: JSON.parse(JSON.stringify(deletedWishes)),
		},
	};
}

const ManageDeleted = ({ celebratorFirstName, deletedWishes }) => {
	const router = useRouter();
	const { slug, wishId } = router.query;

	const classes = useStyles();

	const onRestore = (deletedWishId) => {
		restoreWish(deletedWishId).then((success) => {
			if (success) {
				// refresh page to remount
				router.push("/" + slug + "/manage/" + wishId);
			}
		});
	};

	return (
		<Grid container className={classes.container} justify="center">
			<Grid item xs={12} className={classes.header}>
				<Typography variant="h4">
					{celebratorFirstName || slug}'s Birthday
				</Typography>
			</Grid>
			<Grid item xs={12} className={classes.header}>
				<Typography variant="h5">Deleted Wishes</Typography>
			</Grid>
			{deletedWishes.map((wish) => (
				<DeletedWishEntry
					key={wish._id}
					wish={wish}
					onRestore={onRestore}
				/>
			))}
		</Grid>
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

export default ManageDeleted;
