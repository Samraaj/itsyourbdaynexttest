import mongoose from "mongoose";

let User = new mongoose.Schema({
	name: {
		type: String,
	},
	slug: {
		type: String,
	},
	photo: {
		type: String,
	},
	phone: {
		type: String,
	},
	celebrations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Celebration",
		},
	],
});

User.query.byName = function (name) {
	return this.where({ name: new RegExp(name, "i") });
};

User.query.bySlug = function (slug) {
	return this.where({ slug: new RegExp(slug, "i") });
};

export default mongoose.models.User || mongoose.model("User", User);
