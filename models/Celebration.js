import mongoose from "mongoose";

let Celebration = new mongoose.Schema({
	date: {
		type: String,
	},
	published: {
		type: Boolean,
		default: false,
	},
	textsSent: {
		type: Boolean,
	},
	type: {
		type: String,
		enum: ["birthday"],
		default: "birthday",
	},
	videoLink: {
		type: String,
	},
	responseVideo: {
		type: String,
	},
	shotstackId: {
		type: String,
	},
	collage: {
		type: String,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	main: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Wish",
	},
	wishes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wish",
		},
	],
});

export default mongoose.models.Celebration ||
	mongoose.model("Celebration", Celebration);
