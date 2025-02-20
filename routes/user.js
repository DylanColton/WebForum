const express	= require("express");
const router = express.Router();

const {
	signup,
	login,
	logout,
	assignGuest
} = require("../controllers/user");

router.post("/signup", signup);

module.exports = router;
