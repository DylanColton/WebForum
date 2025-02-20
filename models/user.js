const bcrypt			= require("bcrypt");

const pool				= require("../db");

require("dotenv").config();

// SETTERS
const createUser	= async (username, password, email) => {
	try {
		if (!username) throw new Error("Username is required");
		if (!password) throw new Error("Password is required");
		if (!email) throw new Error("Email is required");

		const hashedPw = await bcrypt.hash(password, parseInt(process.env.hash));
		const query = `
		INSERT INTO users (username, password, email)
		VALUES ($1, $2, $3)
		RETURNING *;
		`;
		const result = await pool.query(query, [username, hashedPw, email]);

		if (result.rows.length === 0) throw new Error("No entry made");

		return result.rows[0];
	} catch (err) {
		throw new Error(`Database error: ${err.message}`);
	}
};

const setTagLine	= async (user_id, tagline) => {
	try {
		if (!user_id) throw new Error("User ID is required");
		if (!tagline) throw new Error("Tagline is required");

		const query = `
		UPDATE users
		SET tagine=$1
		WHERE user_id=$2
		RETURNING *;
		`;
		const result = await pool.query(query, [tagline, user_id]);

		if (result.rows.length === 0) throw new Error("No change was made");

		return result.rows[0];
	} catch (err) {
		throw new Error(`Database error: ${err.message}`);
	}
};

const setSignature	= async (user_id, signature) => {
	try {
		if (!user_id) throw new Error("User ID is required");
		if (!signature) throw new Error("Signature is required");

		const query = `
		UPDATE users
		SET signature=$1
		WHERE user_id=$2
		RETURNING *;
		`;
		const result = await pool.query(query, [signature, user_id]);

		if (result.rows.length === 0) throw new Error("No change was made");

		return result.rows[0];
	} catch (err) {
		throw new Error(`Database error: ${err.message}`);
	}
};

const setAvatar		= async (user_id, avatar) => {
	try {
		if (!user_id) throw new Error("User ID is required");
		if (!avatar) throw new Error("Avatar is required");

		const query = `
		UPDATE users
		SET avatar=$1
		WHERE user_id=$2
		RETURNING *;
		`;
		const result = await pool.query(query, [avatar, user_id]);

		if (result.rows.length === 0) throw new Error("No change was made");

		return result.rows[0];
	} catch (err) {
		throw new Error(`Database error: ${err.message}`);
	}
};

// GETTERS
const getUserByName	= async (user_id) => {
	try {
		if (!user_id) throw new Error("User ID is required");

		const query = `
		SELECT *
		FROM users
		WHERE user_id=$1;
		`;
		const result = await pool.query(query, [user_id]);

		if (result.rows.length === 0) throw new Error("No change was made");

		return result.rows;
	} catch (err) {
		throw new Error(`Database error: ${err.message}`);
	}
};

module.exports = {
	createUser,
	setTagLine,
	setSignature,
	setAvatar,
	getUserByName
};
