const bcrypt			= require("bcrypt");
const jwt				= require("jsonwebtoken");

const { accessSite } 	= require("../middleware/logging");
const User				= require("../models/user");
const pool				= require("../db");

/*
createUser;
setTagLine;
setSignature;
setAvatar;
getUserByName;
*/

const signup		= async (req, res) => {
	const { user, pswd, email } = req.body;

	try {
		const res = await User.createUser(user, pswd, email);
		accessSite(201, req.url, req.cookies.user_id);
		res.status(201).send("User created")
	} catch (err) {
		accessSite(500, req.url, req.cookies.user_id, err.message);
		res.status(500).send("Error 500");
	}
};

const login			= async (req, res) => {
};

const logout		= async (req, res) => {
};

const assignGuest	= async (req, res) => {
};

module.exports = {
	signup,
	login,
	logout,
	assignGuest
};
