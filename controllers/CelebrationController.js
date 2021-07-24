import connectToDb from "../lib/db";
import User from "../models/User";
import Celebration from "../models/Celebration";
import Wish from "../models/Wish";
import TextingService from "../lib/TextingService";

import { generate } from "../lib/ImageGenerator";

export const publish = async (slug) => {
	await connectToDb();

	let user = await User.findOne()
		.bySlug(slug)
		.populate({
			path: "celebrations",
			populate: [
				{
					path: "wishes",
					model: "Wish",
				},
				{
					path: "main",
					model: "Wish",
				},
			],
		})
		.exec();

	let celebration = user.celebrations[0];
	celebration.published = true;
	celebration = await celebration.save();

	TextingService.sendPublishedText(celebration.main.contact, user.name, slug);

	// Generate and send collage for the birthday -> after a few minutes
	setTimeout(() => {
		generateAndSendCollage(user, celebration);
	}, 60000);

	return true;
};

export const unPublish = async (slug) => {
	await connectToDb();

	let user = await User.findOne()
		.bySlug(slug)
		.populate({
			path: "celebrations",
			populate: [
				{
					path: "main",
					model: "Wish",
				},
			],
		})
		.exec();

	let celebration = user.celebrations[0];
	celebration.published = false;
	celebration = await celebration.save();

	return true;
};

export const sendPublishedTexts = async (slug) => {
	await connectToDb();

	let user = await User.findOne()
		.bySlug(slug)
		.populate({
			path: "celebrations",
			populate: [
				{
					path: "wishes",
					model: "Wish",
				},
				{
					path: "main",
					model: "Wish",
				},
			],
		})
		.exec();

	let celebration = user.celebrations[0];

	if (!celebration.published) {
		throw "Cannot send texts if the celebration is not published.";
	}

	if (celebration.textsSent) {
		throw "Texts have already been sent for this celebration.";
	}

	TextingService.sendPublishedTextsToContributors(
		user.name,
		celebration.wishes,
		user.slug,
		celebration.main.contact
	);

	celebration.textsSent = true;
	celebration = await celebration.save();

	return true;
};

export const createReaction = async (slug, reactionPath) => {
	await connectToDb();

	// Get the celebration
	let user = await User.findOne()
		.bySlug(slug)
		.populate({
			path: "celebrations",
		})
		.exec();

	if (!user) return;

	// Upload video
	let reactionLocation = await uploadVideo(reactionPath);

	let celebration = user.celebrations[0];

	celebration.responseVideo = reactionLocation;

	celebration = await celebration.save();

	TextingService.sendReactionTextsToContributors(user, celebration);

	return true;
};

export const getReaction = async (slug) => {
	let user = await User.findOne()
		.bySlug(slug)
		.populate({
			path: "celebrations",
		})
		.exec();

	if (!user) return;

	return user.celebrations[0].responseVideo;
};

const generateAndSendCollage = async (user, celebration) => {
	let images = [];
	celebration.wishes.forEach((wish) => {
		if (wish.image) {
			images.push(wish.image);
		}
	});

	generate(user.name, images).then((imageLocation) => {
		celebration.collage = imageLocation;
		celebration.save();

		// Send the result to texting service
		TextingService.sendCollageTexts(user, celebration, imageLocation);
	});
};
