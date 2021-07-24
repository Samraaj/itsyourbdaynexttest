import { createReaction } from "../../../../controllers/CelebrationController";

import { localFileUpload } from "../../../../lib/VideoUpload";

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
	await localFileUpload(req, res);

	let success = await createReaction(req.query.slug, req.file.path);

	return res.status(200).json({ success: success });
};
