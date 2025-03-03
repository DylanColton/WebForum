const cookieParser		= require("cookie-parser");
const express			= require("express");
const { v4: uuidv4 }	= require("uuid");

const cookie = (req, res, next) => {
	if (!req.cookies.user_id) {
		const guestId = uuidv4();
		res.cookie("user_id", guestId, {
			maxAge		: 1000 * 60 * 60 * 24 * 28,
			httpOnly	: true,
			secure		: false,
			sameSite	: "Strict"
		});
		req.user_id = guestId;
	} else {
		req.user_id = req.cookies.user_id;
	}

	next();
};

module.exports = {
	cookie
};
