const pool	= require("pool");

const getPostsByThread	= async (thread_id) => {
	try {
		const query = `
		SELECT *
		FROM posts
		WHERE thread_id=$1;
		`;

		const result = pool.query(query, [thread_id]);
		if (result.rows.length === 0) throw new Error("Nothing returned by query");

		return result.rows;
	} catch (err) {
		return err;
	}
};

const getPostsByUser	= async (user_id) => {
	try {
		const query = `
		SELECT *
		FROM posts
		WHERE user_id=$1;
		`;
		const result = pool.query(query, [user_id]);
		if (result.rows.length === 0) throw new Error("Nothing returned by query");

		return result.rows;
	} catch (err) {
		return err;
	}
};

module.exports = {
	getPostsByThread,
	getPostsByUser
};
