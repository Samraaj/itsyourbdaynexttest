// db.js
import mongoose from "mongoose";

export default async (req, res) => {
	if (mongoose.connections[0].readyState) return;
	// Using new database connection
	await mongoose.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	console.log("Connected to MongoDB");
};
