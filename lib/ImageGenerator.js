const { createCanvas, loadImage } = require("canvas");
import { uploadImage } from "./VideoUpload";
const path = require("path");
const fs = require("fs");

import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

const backgroundURL =
	"https://itsyourbirthdayvideos.s3-us-west-1.amazonaws.com/images/collage+background.png";

const logoURL =
	"https://itsyourbirthdayvideos.s3-us-west-1.amazonaws.com/images/website+logo.png";

export const generate = async (name, images) => {
	const width = 900;
	const height = 1600;

	// let rowsColumns = getRowsColumns(12);
	let rowsColumns = getRowsColumns(images.length);

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	const backgroundImage = await loadImage(backgroundURL);
	ctx.drawImage(backgroundImage, 0, 0, width, height);

	ctx.fillStyle = "#AFA5B2";

	await drawImageGrid(
		images,
		ctx,
		width,
		height,
		rowsColumns.c,
		rowsColumns.r
	);

	writeText(canvas, ctx, "Happy Birthday", width / 2, 270);
	writeText(canvas, ctx, name + "!", width / 2, 365);

	const logoImage = await loadImage(logoURL);
	ctx.fillStyle = "rgba(200,250,250,0.5)";
	ctx.fillRect(450, 1450, 450, 150);
	ctx.drawImage(logoImage, 450, 1450, 450, 150);

	// Canvas is drawn - write to a local file.
	return new Promise((resolve, reject) => {
		let outDestination = path.resolve(
			serverRuntimeConfig.PROJECT_ROOT,
			"temp",
			"images",
			name + "-collage.jpeg"
		);

		let out = fs.createWriteStream(outDestination);
		let stream = canvas.createJPEGStream();
		stream.pipe(out);

		out.on("finish", () => {
			uploadImage(outDestination).then((location) => {
				fs.unlinkSync(outDestination);
				resolve(location);
			});
		});
	});
};

const getRowsColumns = (numImages) => {
	let n = numImages;
	let found = false;
	let result = {};
	let threshhold = 0.2;
	let aspRatio = 9 / 16;

	while (!found) {
		let factors = findFactorPairs(n);

		if (factors.length > 1) {
			for (var i = 0; i < factors.length; i++) {
				// Find the factor ratio and compare it to the aspect ratio
				let ratio = factors[i].c / factors[i].r;
				if (Math.abs(aspRatio - ratio) < threshhold) {
					result = factors[i];
					found = true;
					break;
				}
			}
		}
		// If not enough factors or within threshold not found, increment
		n++;
	}

	return result;
};

const findFactorPairs = (n) => {
	let res = [];
	let max = Math.sqrt(n);
	for (var i = 1; i < max; i++) {
		let c = n / i;
		let d = Math.floor(c);

		// If no remainder, it's a factor
		if (c == d) {
			res.push({ c: i, r: c });
		}
	}
	return res;
};

const drawImageGrid = async (images, ctx, width, height, columns, rows) => {
	// shuffle array first
	shuffleArray(images);

	let cellBuffer = 10;
	let cellWidth = (width - cellBuffer * 2 * columns) / columns;
	let cellHeight = (height - cellBuffer * 2 * rows) / rows;

	let i = 0;

	// Fill in 2d array of rectangles
	for (var r = 0; r < rows; r++) {
		for (var c = 0; c < columns; c++) {
			let x = cellBuffer + c * cellWidth + 2 * cellBuffer * c;
			let y = cellBuffer + r * cellHeight + 2 * cellBuffer * r;

			if (images[i]) {
				await drawImage(
					images[i],
					ctx,
					x,
					y,
					cellWidth - 2 * cellBuffer,
					cellHeight - 2 * cellBuffer
				);
			}
			i++;
		}
	}
};

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};

const drawImage = async (imgLink, ctx, x, y, w, h) => {
	const img = await loadImage(imgLink);

	// Fit image to destination box
	let scale = 0;
	let destX = x;
	let destY = y;
	if (img.height >= img.width) {
		scale = h / img.height;
		destX += (w - scale * img.width) / 2;
	} else {
		scale = w / img.width;
		destY += (h - scale * img.height) / 2;
	}

	// Rotate picture slightly?
	ctx.save();
	ctx.translate(destX, destY);
	ctx.rotate(-0.15 + Math.random() * 0.3);
	// draw image on canvas
	// ctx.drawImage(img, destX, destY, img.width * scale, img.height * scale);
	ctx.fillRect(-10, -10, img.width * scale + 20, img.height * scale + 20);
	ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
	ctx.restore();
	return;
};

const writeText = (canvas, ctx, text, x, y) => {
	// (TODO) do some checking on the canvas to see if the text will fit.

	// base settings
	ctx.font = "50pt Impact";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#6154A6";

	let textWidth = ctx.measureText(text).width;

	ctx.fillRect(x - textWidth / 2 - 10, y - 15, textWidth + 20, 95);

	ctx.fillStyle = "#fff";
	ctx.fillText(text, x, y);
};
