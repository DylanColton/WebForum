require("dotenv").config();

module.exports = function(req, res, next) {
	res.locals.page = {
		title		: 'Home',
		siteName	: process.env.SITENAME,
		charset		: process.env.CHARSET,
		author		: process.env.AUTHOR,
		desc		: process.env.DESC,
		keys		: process.env.KEYS,
		struc_loc	: process.env.STRUCLOC,
		struc		: process.env.STRUC,
		style_loc	: process.env.STYLELOC,
		style		: process.env.STYLE,
		faviloc		: process.env.FAVILOC,
		favicon		: process.env.FAVICON,
		headLoc		: process.env.HEADLOC,
		head		: process.env.HEAD,
		hfLoc		: process.env.HEADFOOTLOC,
		header		: process.env.HEADER,
		footer		: process.env.FOOTER,
		contentLoc	: process.env.CONTENTLOC,
		content		: "home.ejs"
	};

	next();
};
