const bcrypt	= require("bcrypt");

const pool		= require("../db");

require("dotenv").config();

const createUser = async (username, email, password) => {
	try {
		if (!password) throw new Error("Password is required");

		const hashed = await bcrypt.hash(password, parseInt(process.env.hash))
		const q			= `
			INSERT INTO users (username, email, password)
			VALUES ($1, $2, $3)
			RETURNING *;
		`;
		const result	= pool.query(q, [username, email, password]);

		if (result.rows.length == 0)
			throw new Error("No entry made.\nUser not created");
		return result.rows[0];
	} catch (err) {
		console.error("Error:", err);
	}
};

const getUserByEmail = async (email) => {
	try {
		if (!email) throw new Error("No email provided.\nExiting request");

		const query = `
			SELECT * FROM users WHERE email=$1
		`;
		const result = await pool.query(query, [email]);

		if (result.rows.length == 0)
			throw new Error("No user linked to provided email.");
		return result.rows[0];
	} catch (err) {
		console.error("Error:", err);
	}
};

const saveToken = async (userId, token) => {
	try {
		const query = `UPDATE users SET auth_token = $1 WHERE id=$i`;
		await pool.query(query, [token, userId]);
	} catch (err) {
		console.error(`Error: ${err}`);
		throw err;
	}
};

const clearToken = async () => {
	try {
		const query = `UPDATE users SET auth_token=NULL WHERE id=$1`;
		await pool.query(query, [userId]);
	} catch (err) {
		console.error(`Error: ${err}`);
		throw err;
	}
};

module.exports = {
	createUser,
	getUserByEmail,
	saveToken,
	clearToken
};
