// const ffmpeg = require("ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
import { uploadImage } from "./VideoUpload";
const path = require("path");
const fs = require("fs");

import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export const generateImage = (videoPath) => {
	return new Promise((resolve, reject) => {
		console.log("Generate image promise begun");
		let filename = videoPath.split("/").slice(-1)[0] + ".png";
		ffmpeg(videoPath)
			.screenshots({
				count: 1,
				timestamps: [0],
				filename: filename,
				folder: "temp/images",
			})
			.on("end", () => {
				let localImageLocation = path.resolve(
					serverRuntimeConfig.PROJECT_ROOT,
					"temp",
					"images",
					filename
				);

				console.log("Uploading image...");
				uploadImage(localImageLocation).then((location) => {
					fs.unlinkSync(localImageLocation);
					fs.unlinkSync(videoPath);
					resolve(location);
				});
			});
	});
};

export const getImage = (videoPath, next) => {
	try {
		let filename = videoPath.split("/").slice(-1)[0] + ".png";
		ffmpeg(videoPath)
			.screenshots({
				count: 1,
				timestamps: [0],
				filename: filename,
				folder: "temp/images",
			})
			.on("end", () => {
				let localImageLocation = path.resolve(
					serverRuntimeConfig.PROJECT_ROOT,
					"temp",
					"images",
					filename
				);

				VideoUpload.uploadImage(localImageLocation, (location) => {
					next(location);
					fs.unlinkSync(localImageLocation);
					fs.unlinkSync(videoPath);
				});
			});
	} catch (e) {
		console.log(e);
		console.log(e.code);
		console.log(e.msg);
	}
};
