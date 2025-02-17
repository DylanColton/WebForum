const bcrypt	= require("bcrypt");

const pool		= require("../db");

require("dotenv").config();

const signup	= async (req, res, next) => {
	try {
	} catch (err) {
		console.error(err);
		res.status(400).send({ error: "Invalid" });
	}
};
