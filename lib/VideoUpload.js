const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const fs = require("fs");
const util = require("util");

import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

const s3 = new aws.S3();

aws.config.update({
	secretAccessKey: process.env.S3_SECRET,
	accessKeyId: process.env.S3_ACCESS_KEY,
	region: process.env.S3_REGION,
});

const fileFilter = (req, file, cb) => {
	if (file.fieldname == "video") {
		if (
			file.mimetype === "video/quicktime" ||
			file.mimetype === "video/mp4" ||
			file.mimetype === "video/webm"
		) {
			cb(null, true);
		} else {
			cb(
				new Error(
					"Invalid file type. only quicktime, mp4, and webm are allowed!"
				),
				false
			);
		}
	} else if (file.fieldname == "image") {
		if (file.mimetype === "image/png" || file.mimetype === "image/jpg") {
			cb(null, true);
		} else {
			new Error("Invalid file type. only png and jpg are allowed!");
		}
	}
};

export const localFileUpload = async (req, res) => {
	// first, check destination directory exists
	const directory = path.resolve(
		serverRuntimeConfig.PROJECT_ROOT,
		"temp",
		"videos"
	);

	if (!fs.existsSync(directory)) {
		// create the directory
		fs.mkdirSync(directory);
	}

	const local = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, directory);
		},
		// By default, multer removes file extensions so let's add them back
		filename: function (req, file, cb) {
			cb(null, file.originalname.replace(" ", "-"));
		},
	});

	// Upload the file
	const singleUploadLocal = multer({
		fileFilter: fileFilter,
		storage: local,
	}).single("video");

	const singleUploadLocalPromisified = util.promisify(singleUploadLocal);

	await singleUploadLocalPromisified(req, res);
};

export const upload = multer({
	fileFilter,
	storage: multerS3({
		acl: "public-read",
		s3,
		bucket: process.env.S3_BUCKET_NAME,
		metadata: function (req, file, cb) {
			cb(null, { fieldName: "TESTING_METADATA" });
		},
		key: function (req, file, cb) {
			cb(null, `${Date.now().toString()}${file.originalname}`);
		},
	}),
});

export const uploadImage = async (file) => {
	return await uploadS3Async(file.toString(), "images");
};

export const uploadVideo = async (file) => {
	return await uploadS3Async(file, null);
};

const uploadS3Async = async (file, directory) => {
	let filename = file.toString().split("/").slice(-1)[0];
	let key = directory ? directory + "/" + filename : filename;

	var params = {
		ACL: "public-read",
		Bucket: process.env.S3_BUCKET_NAME,
		Body: fs.createReadStream(file),
		Key: key,
	};

	let data = await s3.upload(params).promise();

	return data.Location;
};
