const methodOverride	= require("method-override");
const bodyParser		= require("body-parser");
const express			= require("express");
const cors				= require("cors");
const ejs				= require("ejs");

require("dotenv").config();

const { authenticate }	= require("./middleware/auth");

const PORT = (parseInt(process.env.TEST) ? process.env.TEST_PORT : process.env.PORT);

let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.status(200).send("Hello");
});

process.on("SIGINT", () => {
	console.log("Closing server. Cleaning resources...");
	process.exit(0);
});
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Listening on 0.0.0.0:${PORT}`);
});
