const pool	= require("../db");

const createUser = async (username, email, password) => {
	const q			= `
		INSERT INTO users (username, email, password)
		VALUES (${username}, ${email}, ${password})
	`;
	const result	= pool.query(q);
}
