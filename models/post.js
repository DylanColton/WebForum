const pool	= require("pool");

const getPosts = async (where, value) => {
	try {
		// where is what we are getting for, i.e. A user or a thread
		if (!where)
			throw new Error("No 'where' stated. Cannot retrieve data from nothing");
		// value is the user id or thread id
		if (!value)
			throw new Error("No 'value' stated. Cannot retrieve all data from posts.");
		const query = `
			SELECT * FROM posts WHERE $1=$2 ORDER BY id DESC;
		`;
		const result = pool.query(query, [where, value]);
		if (result.rows.length == 0)
			throw new Error("No posts returned");
	} catch (err) {
		console.error(`Error: ${err}`);
	}
};

const makePost = async(thread, post_message) => {
	try {
		const query = `
			INSERT INTO posts (poster, thread, board, posted_on)
			VALUES ($1, $2, $3, $4);
		`;
	} catch (err) {
		console.error(`Error: ${err}`);
	}
};

module.exports = {
	getPosts
};
