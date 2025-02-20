const methodOverride	= require("method-override");
const cookieParser		= require("cookie-parser");
const bodyParser		= require("body-parser");
const express			= require("express");
const cors				= require("cors");
const ejs				= require("ejs");

require("dotenv").config();

const userRoutes		= require("./routes/user");
const { cookie }		= require("./middleware/cookie");
const { accessSite }	= require("./middleware/logging");

const PORT = (parseInt(process.env.TEST) ? process.env.TEST_PORT : process.env.PORT);

const page = {
	charset		: process.env.CHARSET,
	lang		: process.env.LANG,
	title		: process.env.TITLE,
	author		: process.env.AUTHOR,
	desc		: process.env.DESC,
	struct		: process.env.STRUCT,
	style_loc	: process.env.STYLE_LOC,
	style		: process.env.STYLE,
	favicon_loc	: process.env.FAVICON_LOC,
	favicon		: process.env.FAVICON
};

let app = express();
app.set("view engine", "ejs");
app.set("views", "views/");
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookie);
app.use("/user", userRoutes);


app.get("/", async (req, res) => {
	try {
		let status = 200;
		accessSite(200, "/", req.cookies.user_id);
		res.status(status).render("index.ejs", Object.assign({}, page, {}));
	} catch (err) {
		let status = 500;
		accessSite(200, "/", req.cookies.user_id, err);
		res.status(status).render("error.ejs", Object.assign({}, page, {
			status	: status,
			title	: "Error "
		}));
	}
});

process.on("SIGINT", () => {
	console.log("Closing server. Cleaning resources...");
	process.exit(0);
});
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Listening on 0.0.0.0:${PORT}`);
});
