import mongoose from "mongoose";

let Wish = new mongoose.Schema({
	name: {
		type: String,
	},
	contact: {
		type: String,
	},
	message: {
		type: String,
	},
	video: {
		type: String,
	},
	image: {
		type: String,
	},
	duration: {
		type: Number,
	},
	processed: {
		type: String,
	},
	deleted: {
		type: Boolean,
	},
	watched: {
		type: Boolean,
	},
	contributeClicked: {
		type: Boolean,
		default: false,
	},
	contributionAmount: {
		type: Number,
	},
	celebration: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Celebration",
	},
});

export default mongoose.models.Wish || mongoose.model("Wish", Wish);
