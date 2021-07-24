import { restoreWish } from "../../../controllers/WishController";

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
	let success = await restoreWish(req.body.wishId);

	return res.status(200).json({ success: success });
};
