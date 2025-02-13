const bcrypt	= require("bcrypt");
const jwt		= require("jsonwebtoken");

const User		= require("../models/user");
const pool		= require("../db");

const signup = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const newUser = await User.createUser(username, email, password);
		if (!newUser)
			throw new Error("No User Created");
		res.status(201).json({ message: "User create", user: newUser });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).json({ error: "Missing Creditials" });

		const user = await User.getUserByEmail(email);
		if (!user)
			return res.status(401).json({ error: "Invalid email or password" });

		const isMatch = await bcrypt.comparse(password, user.password);
		if (!isMatch)
			return res.status(401).json({ error: "Invalid email or password" });

		const token = jwt.sign(
			{ userID: user.id },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
		);

		await User.saveToken(user.id, token);
		res.cookie("token", token,  {
			httpOnly	: true,
			secure		: true,
			sameSite	: "Strict",
			maxAge		: 28 * 24 * 60 * 60 * 100
		});

		res.status(200).json({ message: "Login Successful" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server Error" });
	}
};

const logout = async (req, res) => {
	try {
		const token = req.cookies.token;

		if (!token)
			return res.status(401).json({ error: "No active session" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		await User.clearToken(decoded.userId);

		res.clearCookie("token");

		res.json({ message: "Logged out successfully" });
	} catch (err) {
		console.error(err);
		res.status(401).json({ error: "Invalid or expired session" });
	}
};

module.exports = {
	signup,
	login,
	logout
};
