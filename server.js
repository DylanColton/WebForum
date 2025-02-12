const methodOverride	= require("method-override");
const bodyParser		= require("body-parser");
const express			= require("express");
const cors				= require("cors");
const ejs				= require("ejs");

require("dotenv").config();

const PORT = (parseInt(process.env.TEST) ? process.env.TEST_PORT : process.env.PORT);

let app = express();

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Listening on 0.0.0.0:${PORT}`);
});
