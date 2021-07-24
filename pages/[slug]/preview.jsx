import React from "react";

// Controller
import { getFinalVideo } from "../../controllers/UserController";

// Components
import Layout from "../../components/layout";
import VideoPlayer from "../../components/video/VideoPlayer";

// Server-side data injection
export async function getServerSideProps(context) {
	// Get the full celebration
	let { userId, wishes } = await getFinalVideo(context.params.slug);

	// redirect if celebration doesn't exist
	if (!userId) {
		return {
			redirect: {
				permanent: false,
				destination: "/create",
			},
		};
	}

	return {
		props: {
			wishes: JSON.parse(
				JSON.stringify(wishes.filter((wish) => !!wish.video))
			),
		},
	};
}

const Preview = ({ wishes }) => {
	return (
		<Layout>
			<VideoPlayer wishes={wishes} onComplete={() => {}} />
		</Layout>
	);
};

export default Preview;
