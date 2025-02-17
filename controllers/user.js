const bcrypt			= require("bcrypt");
const jwt				= require("jsonwebtoken");

const { accessSite } 	= require("../middleware/logging");
const User				= require("../models/user");
const pool				= require("../db");

const signup	= async (req, res) => {
};
