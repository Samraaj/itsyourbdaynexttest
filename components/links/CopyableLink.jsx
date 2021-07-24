import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import LinkIcon from "@material-ui/icons/Link";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const CopyableLink = ({ path, size = "large" }) => {
	const router = useRouter();

	const [inputRef, setInputRef] = useState(null);
	const [copied, setCopied] = useState(false);
	const [inputValue, setInputValue] = useState(router.basePath + "/" + path);

	const classes = useStyles();

	useEffect(() => {
		setInputValue(window.location.origin + "/" + path);
	}, []);

	const onClick = () => {
		inputRef.select();
		document.execCommand("copy");
		window.getSelection().removeAllRanges();
		setCopied(true);
	};

	return (
		<Grid
			item
			className={classes.container}
			align="center"
			onClick={onClick}
		>
			<LinkIcon className={classes.icon} />
			<Typography variant="subtitle1">
				<input
					type="text"
					ref={(input) => setInputRef(input)}
					value={inputValue}
					className={classes.hiddenInput}
					readOnly
				/>
			</Typography>

			<Typography gutterBottom variant="caption">
				{copied ? "Copied!" : "Click to copy"}
			</Typography>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		marginBottom: theme.spacing(3),
		padding: theme.spacing(2),
		border: "1px solid " + theme.palette.text.primary,
		borderRadius: 10,
		width: "80%",
	},
	icon: {
		height: 50,
		width: 50,
	},
	hiddenInput: {
		width: "100%",
		textAlign: "center",
		backgroundColor: theme.palette.background.default,
		color: theme.palette.text.primary,
		border: "none",
		fontSize: 15,
	},
}));

export default CopyableLink;
