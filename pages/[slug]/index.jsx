import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

// Controller
import { getFinalVideo } from "../../controllers/UserController";

// Components
import Head from "next/head";
import Confetti from "react-confetti";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Layout from "../../components/layout";
import VideoPlayer from "../../components/video/VideoPlayer";
import ResponseDialog from "../../components/dialog/ResponseDialog";
import ThanksDialog from "../../components/dialog/ThanksDialog";

// Server-side data injection
export async function getServerSideProps(context) {
	// Get the full celebration
	let { name, published, responded, wishes } = await getFinalVideo(
		context.params.slug
	);

	// redirect if the celebration is not published
	if (!published) {
		return {
			redirect: {
				permanent: false,
				destination: "/" + context.params.slug + "/sign",
			},
		};
	}

	return {
		props: {
			wishes: JSON.parse(
				JSON.stringify(wishes.filter((wish) => !!wish.video))
			),
			name: name.split(" ")[0],
			responded: responded,
		},
	};
}

const HappyBirthday = ({ name, responded, wishes }) => {
	// State
	const [confettiRunning, setConfettiRunning] = useState(false);
	// Setting confetti dimensions with state bc of server side rendering
	const [confettiWidth, setConfettiWidth] = useState(1000);
	const [confettiHeight, setConfettiHeight] = useState(1000);
	const [dialogSeen, setDialogSeen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [thanksDialogOpen, setThanksDialogOpen] = useState(false);

	// router
	const router = useRouter();
	const { slug } = router.query;

	// styles
	const classes = useStyles();

	// Ref to the intro video and container
	const intro = useRef();
	const introContainer = useRef();

	// on load
	useEffect(() => {
		setConfettiWidth(window.width);
		setConfettiHeight(window.height);
	}, []);

	// Click handler to start the video
	const onVideoClick = (e) => {
		e.target.play();

		setTimeout(() => {
			setConfettiRunning(true);
		}, 2000);

		e.target.addEventListener(
			"ended",
			(e) => {
				fadeOut(introContainer.current);
				setTimeout(() => {
					setConfettiRunning(false);
				}, 200);
			},
			false
		);
	};

	// Fade out when intro completes
	const fadeOut = (fadeTarget) => {
		var fadeEffect = setInterval(() => {
			if (!fadeTarget.style.opacity) {
				fadeTarget.style.opacity = 1;
				fadeTarget.style.filter = "alpha(opacity=" + 1 * 100 + ")";
			}
			if (fadeTarget.style.opacity > 0) {
				let newOpacity = (fadeTarget.style.opacity -= 0.1);
				fadeTarget.style.opacity = newOpacity;
				fadeTarget.style.filter =
					"alpha(opacity=" + newOpacity * 100 + ")";
			} else {
				clearInterval(fadeEffect);
				fadeTarget.style.display = "none";
				setConfettiRunning(false);
			}
		}, 50);
	};

	const onVideoComplete = () => {
		if (!dialogSeen && !responded) {
			setDialogSeen(true);
			setTimeout(() => {
				setDialogOpen(true);
			}, 3000);
		}
	};

	const onResponseVideoComplete = () => {
		setDialogOpen(false);
		setResponded(true);
		setThanksDialogOpen(true);
	};

	return (
		<React.Fragment>
			<Head>
				<title>Happy Birthday, {name}</title>
			</Head>
			<div className={classes.introContainer} ref={introContainer}>
				<Confetti
					width={confettiWidth}
					height={confettiHeight}
					className={classes.confetti}
					numberOfPieces={50}
					run={confettiRunning}
				/>
				<video
					className={classes.video}
					playsInline
					ref={intro}
					onClick={onVideoClick}
					src="/videos/intro.mp4"
					type="video/mp4"
				></video>
				<Typography variant="body1" className={classes.body}>
					Hey {name}, tap to open your gift
				</Typography>
			</div>
			<Layout>
				<VideoPlayer wishes={wishes} onComplete={onVideoComplete} />
			</Layout>
			<ResponseDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				onComplete={onResponseVideoComplete}
				slug={slug}
			/>
			<ThanksDialog
				open={thanksDialogOpen}
				onClose={() => setThanksDialogOpen(false)}
			/>
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	confetti: {
		zIndex: 30,
	},
	introContainer: {
		zIndex: 10,
		position: "absolute",
		top: 0,
		left: 0,
		height: "100vh",
		width: "100vw",
		backgroundColor: "white",
	},
	video: {
		zIndex: 20,
		maxHeigh: "100%",
		maxWidth: "100%",
		height: "100%",
		width: "100%",
	},
	body: {
		zIndex: 50,
		position: "absolute",
		textAlign: "center",
		top: "70%",
		width: "100vw",
	},
}));

export default HappyBirthday;
