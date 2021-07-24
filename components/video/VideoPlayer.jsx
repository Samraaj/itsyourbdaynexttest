import React, { useState, useEffect, useRef } from "react";

// Material UI components
import Image from "next/image";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import IconButton from "@material-ui/core/IconButton";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { makeStyles } from "@material-ui/core/styles";

const VideoPlayer = ({ wishes, onComplete }) => {
	const [started, setStarted] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [totalTime, setTotalTime] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [videoIndex, setVideoIndex] = useState(0);

	const classes = useStyles();

	// References to the DOM elements needed
	const firstVideo = useRef();
	const secondVideo = useRef();
	const firstSource = useRef();
	const secondSource = useRef();

	const ci = useRef(null);
	const fadingTime = useRef(1); // This variable sets how long the transitions are!

	// Update videos for initial pull
	useEffect(() => {
		if (wishes.length) {
			firstSource.current.src = wishes[0]["video"];
			secondSource.current.src = wishes[1]["video"];
			firstVideo.current.load();
			secondVideo.current.load();
			secondVideo.current.style.display = "none";
			secondVideo.current.style.opacity = 0;
			secondVideo.current.style.filter = "alpha(opacity=" + 0 + ")";
			setPlaying(false);
			setStarted(false);

			let tempTotalTime = 0;
			// Calculate total time
			wishes.forEach((wish) => {
				tempTotalTime += wish.duration;
			});
			setTotalTime(tempTotalTime);
		}
	}, [wishes]);

	// Transition and controls to move through videos
	const addTimingEvents = (video1, source1, video2, source2, index) => {
		const interval = setInterval(() => {
			ci.current = interval;

			// fade in block
			if (
				video1.currentTime <= fadingTime.current &&
				index > 1 &&
				!video1.paused
			) {
				let newOpacity = video1.currentTime / fadingTime.current;

				video1.style.opacity = newOpacity;
				video1.style.filter = "alpha(opacity=" + newOpacity * 100 + ")";
			}

			// main propogation - time tracking block
			setElapsedTime(
				calculateNewTimeElapsed(index - 1, video1.currentTime)
			);

			// Fade out block
			let remainingTime = video1.duration - video1.currentTime;
			if (
				remainingTime <= fadingTime.current &&
				video2 != null &&
				!video1.paused
			) {
				let newOpacity = remainingTime / fadingTime.current;

				video1.style.opacity = newOpacity;
				video1.style.filter = "alpha(opacity=" + newOpacity * 100 + ")";
			}

			if (remainingTime < 0.1 && video2 == null) {
				// last video is completed -> call finished callback
				onComplete();
				clearInterval(interval);
			}

			// video completed, finish and set up for next video
			if (remainingTime <= 0.1 && video2 != null) {
				// Set up timing events for next video
				if (index < wishes.length - 1) {
					source1.src = wishes[index + 1]["video"];
					video1.load();
					addTimingEvents(
						video2,
						source2,
						video1,
						source1,
						index + 1
					);
				} else {
					addTimingEvents(video2, source2, null, null, index + 1);
				}

				// Reset display parameters and start next video
				video1.style.display = "none";
				video2.style.display = "block";
				video2.play();

				// re set the new video index
				setVideoIndex(index);

				// clear interval now that it is completed
				clearInterval(interval);
				return;
			}
		}, 20);
	};

	const handlePlayPauseClick = () => {
		playing ? pause() : play();
	};

	const play = () => {
		setPlaying(true);
		if (firstVideo.current.style.display == "none") {
			secondVideo.current.play();
		} else {
			firstVideo.current.play();
		}
	};

	const pause = () => {
		setPlaying(false);
		firstVideo.current.pause();
		secondVideo.current.pause();
	};

	const startVideo = () => {
		firstVideo.current.playbackRate = 1;
		secondVideo.current.play();
		secondVideo.current.pause();
		firstVideo.current.play();
		setPlaying(true);
		setStarted(true);
		addTimingEvents(
			firstVideo.current,
			firstSource.current,
			secondVideo.current,
			secondSource.current,
			1
		);
	};

	const calculateNewTimeElapsed = (videoIndex, time) => {
		let res = 0;
		for (var i = 0; i < videoIndex; i++) {
			res += wishes[i].duration;
		}
		res += time;
		return res;
	};

	const seekCommit = (e, v) => {
		let videoTime = (v / 100) * totalTime;

		// Find the correct video for the given time
		let i = 0;
		for (i; i < wishes.length; i++) {
			if (wishes[i].duration > videoTime) {
				break;
			} else {
				videoTime -= wishes[i].duration;
			}
		}

		// Set the new current video to the first element
		firstSource.current.src = wishes[i]["video"];
		firstVideo.current.load();
		firstVideo.current.currentTime = videoTime;
		firstVideo.current.style.display = "block";
		firstVideo.current.style.opacity = 1;

		// Clear second element display
		secondVideo.current.style.display = "none";
		secondVideo.current.style.opacity = 0;

		// re - set the current state based on seek
		setVideoIndex(i);
		setElapsedTime(videoTime);

		// Restart timing events for videos
		if (i < wishes.length - 1) {
			// if next video exits
			secondSource.current.src = wishes[i + 1]["video"];
			secondVideo.current.load();
			addTimingEvents(
				firstVideo.current,
				firstSource.current,
				secondVideo.current,
				secondSource.current,
				i + 1
			);
		} else {
			// skipped to the last video - send it with a null second video
			addTimingEvents(
				firstVideo.current,
				firstSource.current,
				null,
				null,
				i + 1
			);
		}

		// if video was already playing, resume
		if (playing) {
			play();
		}
	};

	const seek = (e, v) => {
		if (playing) {
			firstVideo.current.pause();
			secondVideo.current.pause();
		}
		// Remove event listeners until seek is completed
		clearInterval(ci.current);

		setElapsedTime((v / 100) * totalTime);
	};

	return (
		<Grid
			container
			className={classes.container}
			direction="column"
			justify="center"
			alignItems="center"
		>
			<Image height={120} width={1000} src="/images/textlogo.svg" />
			<Grid
				item
				container
				xs={12}
				md={6}
				direction="column"
				alignItems="center"
				className={classes.videoContainer}
			>
				<div className={classes.videoParent}>
					<video
						className={classes.video}
						id="video-element-1"
						playsInline
						ref={firstVideo}
					>
						<source
							id="source-element-1"
							type="video/mp4"
							ref={firstSource}
						/>
					</video>
					<video
						className={classes.video}
						id="video-element-2"
						playsInline
						ref={secondVideo}
					>
						<source
							id="source-element-2"
							type="video/mp4"
							ref={secondSource}
						/>
					</video>
				</div>
			</Grid>
			<Grid
				item
				container
				xs={10}
				direction="column"
				alignItems="center"
				className={classes.controlsContainer}
			>
				{started ? (
					<IconButton color="primary" onClick={handlePlayPauseClick}>
						{playing ? <PauseIcon /> : <PlayArrowIcon />}
					</IconButton>
				) : (
					<IconButton color="primary" onClick={startVideo}>
						<PlayArrowIcon />
					</IconButton>
				)}
				<Slider
					className={classes.slider}
					value={(elapsedTime / totalTime) * 100}
					onChangeCommitted={seekCommit}
					onChange={seek}
				/>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: "5%",
		marginBottom: "5%",
		// width: "100%",
		// height: "100%",
	},
	hidden: {
		display: "none",
	},
	controlsContainer: {},
	videoContainer: {},
	videoParent: {
		position: "relative",
		top: 0,
		left: 0,
		width: "100%",
		height: "60vh",
	},
	video: {
		maxHeight: "100%",
		maxWidth: "100%",
		height: "100%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
	},
	slider: {},
}));

export default VideoPlayer;
