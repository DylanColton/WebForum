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
getUserByNameAndPass;
getUserByEmailAndPass;
*/

const signup		= async (req, res) => {
	const { user, pswd, email } = req.body;

	try {
		const result = await User.createUser(user, pswd, email);
		accessSite(201, req.url, req.cookies.user_id);
		res.status(201).send(`User created:\n${result}`);
	} catch (err) {
		accessSite(500, req.url, req.cookies.user_id, err.message);
		res.status(500).send("Error 500");
	}
};

const login			= async (req, res) => {
	const { user, pswd, email } = req.body;

	try {
		if (!(user || email)) throw new Error("Username or email required for login");
		if (!pswd) throw new Error("Password is required for login");

		if (!user) {
			const result = await User.getUserByNameAndPass(user, pswd);
			if (result.rows.length === 0) throw new Error("No user exists");
			accessSite(200, req.url, req.cookies.user_id);
			res.status(200).send(`User created:\n${result}`);
		} else {
			const result = await User.getUserByEmailAndPass(email, pswd);
			if (result.rows.length === 0) throw new Error("No user exists");
			accessSite(200, req.url, req.cookies.user_id);
			res.status(200).send(`User created:\n${result}`);
		}
	} catch (err) {
		accessSite(500, req.url, req.cookies.user_id, err.message);
		res.status(500).send({ error: err });
	}
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
