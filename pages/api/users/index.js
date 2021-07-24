import { createUser } from "../../../controllers/UserController";

export default async (req, res) => {
	switch (req.method) {
		case "GET":
			res.status(405).end(); //Method Not Allowed
			break;
		case "POST":
			post(req, res);
			break;
		default:
			res.status(405).end(); //Method Not Allowed
			break;
	}
};

const post = async (req, res) => {
	let user = await createUser(req.body);

	res.status(200).json({ success: true, slug: user.slug });
};
