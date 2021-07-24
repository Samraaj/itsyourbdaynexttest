const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv").config();

const dev = process.env.ENVIRONMENT !== "production";
const next = require("next");
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
	// Start up express backend server
	const server = express();

	server.use(cors());
	server.use(bodyParser.urlencoded({ extended: false }));
	server.use(bodyParser.json());

	// Nextjs handles all non-API requests
	server.get("*", (req, res) => {
		return handle(req, res);
	});

	server.post("*", (req, res) => {
		return handle(req, res);
	});

	server.put("*", (req, res) => {
		return handle(req, res);
	});

	server.delete("*", (req, res) => {
		return handle(req, res);
	});

	/* eslint-disable no-console */
	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log("Server ready on port " + PORT);
		console.log("Deployed on heroku");
	});
});
