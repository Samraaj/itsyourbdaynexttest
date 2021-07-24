import axios from "axios";

// REWRITTEN SECTION

export const createUser = async (userData) => {
	let res = await axios.post("/api/users/", userData);

	return res.data.slug;
};

export const getAvailableSlug = async (name) => {
	let res = await axios.get("/api/users/availableslug/" + encodeURI(name));

	return res.data.slug;
};

export const createWish = async (wishData) => {
	// Set up form data for multipart upload
	const formData = new FormData();
	formData.append("video", wishData.video);
	formData.append("duration", wishData.duration);
	formData.append("name", wishData.name);
	formData.append("contact", wishData.contact);
	formData.append("celebrationId", wishData.celebrationId);

	const config = {
		headers: {
			"content-type": "multipart/form-data",
		},
	};

	let res = await axios.post("/api/wishes", formData, config);

	return res.data;
};

export const publishCelebration = async (slug) => {
	let res = await axios.post("/api/celebrations/" + slug + "/publish");

	return res.data.success;
};

export const unPublishCelebration = async (slug) => {
	let res = await axios.post("/api/celebrations/" + slug + "/unpublish");

	return res.data.success;
};

export const sendCelebrationTexts = async (slug) => {
	let res = await axios.post("/api/celebrations/" + slug + "/sendtexts");

	return res.data.success;
};

export const deleteWish = async (wishId) => {
	let res = await axios.delete("/api/wishes/", { data: { wishId: wishId } });

	return res.data.success;
};

export const restoreWish = async (wishId) => {
	let res = await axios.post("/api/wishes/restore", { wishId: wishId });

	return res.data.success;
};

export const reorderWish = async (wishId, position) => {
	let res = await axios.put("/api/wishes/", {
		wishId: wishId,
		position: position,
	});

	return res.data.success;
};

export const setWishWatched = async (wishId) => {
	let res = await axios.post("/api/wishes/watch", { wishId: wishId });

	return res.data.success;
};

export const createReaction = async (slug, reactionData) => {
	// Set up form data for multipart upload
	const formData = new FormData();
	formData.append("video", reactionData.video);
	formData.append("contact", reactionData.contact);

	const config = {
		headers: {
			"content-type": "multipart/form-data",
		},
	};

	let res = await axios.post(
		"/api/celebrations/" + slug + "/reaction",
		formData,
		config
	);

	return res.data;
};

export const createReactionLater = async (slug, phone) => {
	let res = await axios.post("/api/users/reactlater", {
		slug: slug,
		phone: phone,
	});

	return res.data;
};

// END REWRITTEN SECTION

export const createBirthdayUserOld = async (userData, next) => {
	axios
		.post("/api/users/birthdayUser", userData)
		.then((res) => {
			if (res.data.success) {
				// redirect based on slug and wish id
				next(res.data.slug, res.data.wishId);
			}
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
		});
};

export const getAvailableSlugOld = (name, next) => {
	axios.get("/api/users/availableslug/" + encodeURI(name)).then((res) => {
		next(res.data.slug);
	});
};

export const getBirthday = (slug, next) => {
	axios
		.get("/api/users/slug/" + slug)
		.then((res) => {
			let user = {
				name: res.data.name,
				firstName: res.data.name.split(" ")[0],
				photo: res.data.photo,
			};
			let rawCelebration = res.data.celebrations[0];
			let celebration = {
				date: rawCelebration.date,
				type: rawCelebration.type,
				published: rawCelebration.published,
				id: rawCelebration._id,
				mainWishId: rawCelebration.main._id,
				responded: !!rawCelebration.responseVideo,
			};
			next(user, celebration, rawCelebration.main.name);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
		});
};

export const createBirthdayWish = (wishData, celebrationId, next) => {
	axios
		.post("/api/wishes/birthdayWish/" + celebrationId, wishData)
		.then((res) => {
			next(res.data);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
		});
};

export const createBirthdayVideoOld = (wishData, celebrationId, next) => {
	// Set up form data for multipart upload
	const formData = new FormData();
	formData.append("video", wishData.video);
	formData.append("duration", wishData.duration);
	formData.append("name", wishData.name);
	formData.append("contact", wishData.contact);

	const config = {
		headers: {
			"content-type": "multipart/form-data",
		},
	};

	axios
		.post("/api/wishes/birthdayVideo/" + celebrationId, formData, config)
		.then((res) => {
			next(res.data);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
		});
};

export const getFinalCelebration = (slug, next) => {
	axios
		.get("/api/celebrations/" + slug)
		.then((res) => {
			let rawCelebration = res.data.celebrations[0];
			next(res.data.name, rawCelebration.videoLink);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
		});
};

export const getBirthdayManage = (slug, next) => {
	axios
		.get("/api/users/slug/" + slug + "/manage")
		.then((res) => {
			let user = {
				name: res.data.name,
				firstName: res.data.name.split(" ")[0],
				photo: res.data.photo,
			};
			let rawCelebration = res.data.celebrations[0];
			let celebration = {
				date: rawCelebration.date,
				type: rawCelebration.type,
				published: rawCelebration.published,
				textsSent: rawCelebration.textsSent,
				id: rawCelebration._id,
			};
			next(user, celebration, rawCelebration.main, rawCelebration.wishes);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
		});
};

export const getFinalBirthdayVideo = (slug, next, fail) => {
	axios
		.get("/api/users/" + slug + "/final")
		.then((res) => {
			next(
				res.data.name,
				res.data.published,
				res.data.responded,
				res.data.wishes
			);
		})
		.catch((err) => {
			console.log(err);
			fail();
		});
};

export const setWatchedOld = (wishId) => {
	console.log("posting to ");
	console.log("/api/users/watched/" + wishId);
	axios.post("/api/wishes/watched/" + wishId).catch((err) => {
		console.log(err);
		let payload = err.response ? err.response.data : err;
		console.log(payload);
		console.log("failed to set wish watched");
	});
};

export const getDeletedWishes = (celebrationId, next) => {
	axios
		.get("/api/wishes/deleted/" + celebrationId)
		.then((res) => {
			next(res.data);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};

export const publishCelebrationOld = (slug, next) => {
	axios
		.post("/api/celebrations/" + slug + "/publish")
		.then((res) => {
			next(res.data.success);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};

export const unPublishCelebrationOld = (slug, next) => {
	axios
		.post("/api/celebrations/" + slug + "/unpublish")
		.then((res) => {
			next(res.data.success);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};

export const createResponseLaterOLD = (slug, phone, next) => {
	axios
		.post("/api/users/" + slug + "/respondLater", { phone: phone })
		.then((res) => {
			next(res.data);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
		});
};

export const createResponseVideoOld = (slug, responseData, next) => {
	// Set up form data for multipart upload
	const formData = new FormData();
	formData.append("video", responseData.video);
	formData.append("contact", responseData.contact);

	const config = {
		headers: {
			"content-type": "multipart/form-data",
		},
	};

	axios
		.post("/api/celebrations/" + slug + "/response", formData, config)
		.then((res) => {
			next(res.data);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
		});
};

export const getResponseVideo = (slug, next, fail) => {
	axios
		.get("/api/celebrations/" + slug + "/response")
		.then((res) => {
			next(res.data.responseVideo);
		})
		.catch((err) => {
			console.log(err);
			fail();
		});
};

export const sendCelebrationTextsOld = (slug, next) => {
	axios
		.post("/api/celebrations/" + slug + "/sendtexts")
		.then((res) => {
			next(res.data.success);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};

export const deleteWishOld = (wishId, next) => {
	axios
		.delete("/api/wishes/" + wishId)
		.then((res) => {
			next(res.data.success);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};

export const restoreWishOld = (wishId, next) => {
	axios
		.post("/api/wishes/restore/" + wishId)
		.then((res) => {
			next(res.data.success);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};

export const reorderWishOld = (wishId, position, next) => {
	axios
		.post("/api/wishes/reorder", { wishId: wishId, position: position })
		.then((res) => {
			next(res.data.success);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};

export const contributionClicked = (wishId, next) => {
	axios
		.post("/api/wishes/contributionClicked/" + wishId)
		.then((res) => {
			next(res.data.success);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};

export const setContribution = (wishId, amount, next) => {
	axios
		.post("/api/wishes/setContribution/" + wishId, { amount: amount })
		.then((res) => {
			next(res.data.success);
		})
		.catch((err) => {
			let payload = err.response ? err.response.data : err;
			console.log(payload);
			next(false);
		});
};
