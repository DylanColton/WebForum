const express	= require("express");
const router = express.Router();

const {
	signup,
	login,
	logout,
	assignGuest
} = require("../controllers/user");

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/assignGuest", assignGuest);

module.exports = router;
