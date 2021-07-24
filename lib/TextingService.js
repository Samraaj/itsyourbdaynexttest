const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_NUMBER;
const client = require("twilio")(accountSid, authToken);

const send = async (to, body) => {
	let message = await client.messages.create({
		body: body,
		from: from,
		to: to,
	});
	return true;
};

const sendMMS = async (to, body, mediaLocation) => {
	let message = await client.messages.create({
		body: body,
		mediaUrl: [mediaLocation],
		from: from,
		to: to,
	});
	return true;
};

// Expects array of objects with to and body
const sendMultiple = async (messages) => {
	let successes = 0;
	for (let index = 0; index < messages.length; index++) {
		try {
			let message = await client.messages.create({
				body: messages[index].body,
				from: from,
				to: messages[index].to,
			});
			message.sid ? successes++ : null;
		} catch (error) {
			console.log("TWILIO ERROR - couldn't send texts");
			console.log(error);
		}
	}
	return successes;
};

exports.sendWelcomeTexts = (user, celebration, wish) => {
	let num = wish.contact;
	let wisherFirstName = wish.name.split(" ")[0];
	let firstName = user.name.split(" ")[0];

	let firstMessage = `Hi ${wisherFirstName}! Thanks for making this for ${firstName}, it will be cherished :). Please send this link to ${firstName}'s friends so they can make birthday videos :)`;
	let secondMessage = `https://www.itsyourbday.co/${user.slug}/sign`;
	let thirdMessage = `To see all of the wishes and publish the video, visit your admin panel - https://www.itsyourbday.co/${user.slug}/manage/${wish.id}`;
	let fourthMessage = `If you have any questions or need help, just shoot us a text at +1(206)659-7040`;

	sendMultiple([
		{ to: num, body: firstMessage },
		{ to: num, body: secondMessage },
		{ to: num, body: thirdMessage },
		{ to: num, body: fourthMessage },
	])
		.then((successes) => {
			console.log("sent " + successes + "texts");
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.sendPostWishTexts = (user, celebration, wish) => {
	let num = wish.contact;
	let mainNum = celebration.main.contact;
	let wisherFirstName = wish.name.split(" ")[0];
	let firstName = user.name.split(" ")[0];

	let firstMessage = `Hi ${wisherFirstName}! Thank you so much for wishing ${firstName}, I'm sure they're going to love it. We'll send you a text when the final result is ready to view!`;
	let mainWisherMessage = `${wisherFirstName} just made a wish for ${firstName}. Visit your admin panel to take a look, publish, or preview the final video - https://www.itsyourbday.co/${user.slug}/manage/${wish.id}`;

	sendMultiple([
		{ to: num, body: firstMessage },
		{ to: mainNum, body: mainWisherMessage },
	])
		.then((successes) => {
			console.log("sent " + successes + " texts");
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.sendPublishedTextsToContributors = (
	name,
	wishes,
	slug,
	mainContact
) => {
	let texts = [];
	let promotexts = [];
	let baseLink = "https://www.itsyourbday.co/" + slug;

	wishes.forEach((wish) => {
		let link = `${baseLink}/view/${wish._id}`;

		if (wish.contact != mainContact) {
			texts.push({
				to: wish.contact,
				body: `${
					name.split(" ")[0]
				}'s montage is ready! Watch it now - ${link}`,
			});
			promotexts.push({
				to: wish.contact,
				body: `We hope you loved ${
					name.split(" ")[0]
				}'s video! If you know someone whose birthday is coming up, we invite you to use our service for free! Just go to https://www.itsyourbday.co/create and get started in literally 1 minute.`,
			});
		}
	});

	// Add last text for the main contact
	texts.push({
		to: mainContact,
		body: "Texts were sent to contributors successfully.",
	});

	// Send regular texts immediately
	sendMultiple(texts)
		.then((successes) => {
			console.log("sent " + successes + " texts");
		})
		.catch((err) => {
			console.log(err);
		});

	setTimeout(() => {
		sendMultiple(promotexts)
			.then((successes) => {
				console.log("sent " + successes + " texts");
			})
			.catch((err) => {
				console.log(err);
			});
	}, 6000000);
};

exports.sendReactionTextsToContributors = async (user, celebration) => {
	let texts = [];
	let firstName = user.name.split(" ")[0];
	let link = `https://www.itsyourbday.co/${user.slug}/reaction`;

	celebration.wishes.forEach((wish) => {
		texts.push({
			to: wish.contact,
			body: `${firstName} filmed a reaction video to the montage! Watch it now - ${link}`,
		});
	});

	// Add last text for the birthday contact
	texts.push({
		to: user.phone,
		body: `We just sent out your reaction video to everyone who contributed. Happy birthday ${firstName}!`,
	});

	// Send regular texts immediately
	sendMultiple(texts)
		.then((successes) => {
			console.log("sent " + successes + " texts");
		})
		.catch((err) => {
			console.log(err);
		});

	setTimeout(() => {
		let collageMsg = `We also made you a collage for your birthday! Check it out! if you decide to post to Instagram, please tag us @itsyourbdayco :)`;

		sendMMS(user.phone, collageMsg, celebration.collage)
			.then((success) => {
				if (success) {
					console.log("sent 1 text");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, 10000);
};

exports.sendPublishedText = async (number, name, slug) => {
	texts = [
		{
			to: number,
			body: `${
				name.split(" ")[0]
			}'s montage is ready! You can share the result link with them:`,
		},
		{
			to: number,
			body: "https://www.itsyourbday.co/" + slug,
		},
	];

	sendMultiple(texts)
		.then((successes) => {
			console.log("sent " + successes + " texts");
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.sendCollageTexts = (user, celebration, collageLocation) => {
	let num = celebration.main.contact;
	let firstName = user.name.split(" ")[0];

	let msg = `We also made an easily shareable image collage for ${firstName}'s birthday, check it out! If you decide to post to instagram, please tag us @itsyourbdayco :)`;

	sendMMS(num, msg, collageLocation)
		.then((success) => {
			if (success) {
				console.log("sent 1 text");
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.sendRespondLaterTexts = (user, celebration) => {
	let num = user.phone;
	let firstName = user.name.split(" ")[0];
	let link = `https://www.itsyourbday.co/${user.slug}/createReaction`;

	let msg = `Hey ${firstName}! Use the following link to record a reaction video whenever you want. When you submit, it'll automatically be sent to everyone who contributed. ${link}`;

	send(num, msg)
		.then((success) => {
			console.log("sent 1 text");
		})
		.catch((err) => {
			console.log(err);
		});
};
