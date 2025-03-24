const express	= require("express");
const path		= require("path");
const ejs		= require("ejs");

require("dotenv").config();

const page_data = require("./middleware/page_data.js");

let PORT = (process.env.TEST ? process.env.TEST_PORT : (process.env.PORT ? process.env.PORT : 3000));

let app = express();

// Configuring the express app
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(page_data);

app.get("/", (req, res) => {
	res.render("index.ejs");
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
