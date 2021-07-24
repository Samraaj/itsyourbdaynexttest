import connectToDb from "../lib/db";
import User from "../models/User";
import Celebration from "../models/Celebration";
import Wish from "../models/Wish";
import TextingService from "../lib/TextingService";

export const createUser = async (userData) => {
	await connectToDb();

	// get the computed
	let slug = await getAvailableSlug(userData.name);

	let user = new User({
		name: userData.name,
		slug: slug,
	});

	user = await user.save();

	// user is created, now create the celebration object
	let celebration = new Celebration({
		date: userData.date,
		user: user,
		type: "birthday",
		published: false,
	});

	celebration = await celebration.save();

	// Celebration is created, make the main wish object
	let wish = new Wish({
		name: userData.wisherName,
		contact: userData.contact,
		celebration: celebration,
	});

	wish = await wish.save();

	// Completed saving, now create the links in celebration and user
	celebration.main = wish;
	celebration.wishes.push(wish);
	celebration = await celebration.save();

	user.celebrations.push(celebration);
	user = await user.save();

	// send out the welcome texts to the wisher
	// Async, don't "await" this one
	TextingService.sendWelcomeTexts(user, celebration, wish);

	return user;
};

// Gets rudimentary birthday info
export const getBirthdayInfo = async (slug) => {
	await connectToDb();

	let user = await User.findOne()
		.bySlug(slug)
		.populate({
			path: "celebrations",
		})
		.exec();

	if (!user) return {};

	return {
		name: user.name,
		date: user.date,
		type: user.type,
		celebrationId: user.celebrations[0]._id,
		published: user.celebrations[0].published,
		textsSent: !!user.celebrations[0].textsSent,
		responded: !!user.celebrations[0].responseVideo,
		mainWishId: user.celebrations[0].main,
	};
};

export const getFinalVideo = async (slug) => {
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

	if (!user) return {};

	let cel = user.celebrations[0];
	return {
		userId: user._id,
		name: user.name,
		wishes: cel.wishes,
		published: cel.published,
		responded: !!cel.responseVideo,
		date: cel.date,
		type: cel.type,
	};
};

// Finds a slug that is available based on the given names
export const getAvailableSlug = async (name) => {
	await connectToDb();

	// Split the input name by spaces
	const names = name.toLowerCase().split(" ");
	// Check if a slug is available for each of the name combos
	let i = 0;
	let slug = "";
	let found = false;
	while (i < names.length) {
		slug += names[i];
		// check if a slug exists in the db
		let exists = await User.countDocuments({ slug: slug }).exec();
		if (!exists) {
			found = true;
			break;
		}
		i++;
	}
	if (found) {
		// Got a match on the slug
		return slug;
	}
	// have to add numbers to the slug to get it to work :0
	i = 0;
	while (1) {
		slug = names[0] + i;
		let exists = await User.countDocuments({ slug: slug }).exec();
		if (!exists) {
			found = true;
			break;
		}
		i++;
	}

	return slug;
};

export const reactLater = async (slug, phone) => {
	await connectToDb();

	let user = await User.findOne()
		.bySlug(slug)
		.populate({
			path: "celebrations",
		})
		.exec();

	if (!user) return {};

	let cel = user.celebrations[0];
	user.phone = phone;

	user = await user.save();

	TextingService.sendRespondLaterTexts(user, cel);

	return true;
};
