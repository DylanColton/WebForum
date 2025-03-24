const express	= require("express");
const ejs		= require("ejs");

let PORT = 3000;

let app = express();

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
