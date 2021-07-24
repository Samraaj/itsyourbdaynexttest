import { reactLater } from "../../../controllers/UserController";

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
	let success = await reactLater(req.body.slug, req.body.phone);

	return res.status(200).json({ success: success });
};
