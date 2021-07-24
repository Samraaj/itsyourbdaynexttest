import {
	createWish,
	deleteWish,
	reorderWish,
} from "../../../controllers/WishController";
import { localFileUpload } from "../../../lib/VideoUpload";

export default async (req, res) => {
	switch (req.method) {
		case "POST":
			await post(req, res);
			break;
		case "DELETE":
			await del(req, res);
			break;
		case "PUT":
			await put(req, res);
			break;
		default:
			res.status(405).end(); //Method Not Allowed
			break;
	}
};

const post = async (req, res) => {
	await localFileUpload(req, res);

	let wish = await createWish(req.body, req.file.path);
	return res.status(200).json(wish);
};

const put = async (req, res) => {
	let success = await reorderWish(req.body.wishId, req.body.position);

	res.status(200).json({ success: success });
};

const del = async (req, res) => {
	let success = await deleteWish(req.body.wishId);

	res.status(200).json({ success: success });
};
