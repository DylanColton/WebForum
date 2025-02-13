const jwt	= require("jsonwebtoken");

const pool	= require("../db");

const authenticate = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token)
			return res.status(401).json({ error: "Unauthorized" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await pool.query(
			`SELECT id FROM users WHERE id=$1 AND auth_token=$2`,
			[decoded.userId, token]
		);

		if (user.rows.length === 0)
			return res.status(401).json({ error: "Invalid or expired token" });

		const now = Math.floor(Date.now() / 1000);
		const timeRemaining = decoded.exp - now;

		if (timeRemaining < 27 * 24 * 60 * 60 * 1000) {
			const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "28d" });

			await pool.query("UPDATE users SET auth_token=$1 WHERE id=$2" [newToken, decoded.userId]);

			res.cookie("token", newToken, {
				httpOnly	: true,
				secure		: true,
				sameSite	: "Strict",
				maxAge		: 28 * 24 * 60 * 60 * 1000
			});
		}

		req.userId = decoded.userId;
		next();
	} catch (err) {
		res.send(401).json({ error: "Invalid Token" });
	}
};

module.exports = { authenticate };
