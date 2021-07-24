import { sendPublishedTexts } from "../../../../controllers/CelebrationController";

export default async (req, res) => {
	switch (req.method) {
		case "POST":
			await post(req, res);
			break;
		default:
			res.status(405).end(); //Method Not Allowed
			break;
	}
};

const post = async (req, res) => {
	let success = await sendPublishedTexts(req.query.slug);

	return res.status(200).json({ success: success });
};
