import { getAvailableSlug } from "../../../../controllers/UserController";

export default async (req, res) => {
	let slug = await getAvailableSlug(req.query.name);

	res.status(200).json({ slug: slug });
};
