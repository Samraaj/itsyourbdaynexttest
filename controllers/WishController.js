import connectToDb from "../lib/db";
import User from "../models/User";
import Celebration from "../models/Celebration";
import Wish from "../models/Wish";
import TextingService from "../lib/TextingService";
import { uploadVideo } from "../lib/VideoUpload";
import { generateImage } from "../lib/ExtractThumbnail";

export const createWish = async (wishData, videoPath) => {
	await connectToDb();

	let videoLocation = await uploadVideo(videoPath);

	// Create the new wish
	let wish = new Wish({
		name: wishData.name,
		contact: wishData.contact,
		video: videoLocation,
		duration: wishData.duration,
		celebration: wishData.celebrationId,
		processed: false,
	});

	wish = await wish.save();

	// Save the new celebration ID back to the user
	let celebration = await Celebration.findById(wishData.celebrationId)
		.populate("user")
		.populate("main")
		.exec();

	celebration.wishes.push(wish);
	celebration = await celebration.save();

	// Start service to save the first frame of the video
	let imageLocation = await generateImage(videoPath);
	wish.image = imageLocation;
	wish = await wish.save();

	// Send texts to the wisher and the admin
	TextingService.sendPostWishTexts(celebration.user, celebration, wish);

	return wish;
};

export const getWishes = async (slug) => {
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

	return user.celebrations[0].wishes;
};

export const deleteWish = async (wishId) => {
	await connectToDb();

	let wish = await Wish.findById(wishId).populate("celebration").exec();

	wish.deleted = true;
	wish = await wish.save();

	wish.celebration.wishes = wish.celebration.wishes.filter(
		(listWish) => listWish._id != wishId
	);

	await wish.celebration.save();
	return true;
};

export const restoreWish = async (wishId) => {
	await connectToDb();

	let wish = await Wish.findById(wishId).populate("celebration").exec();

	wish.deleted = false;
	wish = await wish.save();

	wish.celebration.wishes.push(wish);
	await wish.celebration.save();
	return true;
};

export const reorderWish = async (wishId, position) => {
	await connectToDb();

	let wish = await Wish.findById(wishId).populate("celebration").exec();

	let wishes = wish.celebration.wishes;
	let elementIndex = wishes.findIndex((listWish) => listWish._id == wishId);

	// splice the array
	wishes.splice(position, 0, wishes.splice(elementIndex, 1)[0]);

	// save
	await wish.celebration.save();

	return true;
};

export const getDeletedWishes = async (slug) => {
	await connectToDb();

	let user = await User.findOne().bySlug(slug).exec();

	let wishes = await Wish.find({
		celebration: user.celebrations[0],
		deleted: true,
	}).exec();

	return wishes;
};

export const setWatched = async (wishId) => {
	await connectToDb();

	await connectToDb();

	let wish = await Wish.findById(wishId).exec();

	if (!wish) return false;

	wish.watched = true;
	wish = await wish.save();

	return true;
};
