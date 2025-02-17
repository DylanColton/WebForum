const path	= require("path");
const fs	= require("fs");

require("dotenv").config();

const accessSite = (uri, status, err) => {
	if (err) {
		fs.append(
			__dirname+'/logs/error.log',
			`Timestamp,Status,URI,User,Error`,
			(error) => {});
	}
	fs.appendFile(
		__dirname+'/logs/access.log',
		`Timestamp,Status,URI,User`,
		(error) => {});
};

function rotateFiles(logFile, maxFiles) {
	for (let i = maxFiles - 1; i >= 0; i--) {
		const currentFile = i === 0 ? logFile : `${logFile}.${i}`;
		const nextFile = `${logFile}.${i+1}`;

		if (fs.existsSync(currentFile)) {
			if (i + 1 == maxFiles)
				fs.unlinkSync(nextFile);
			fs.renameSync(currentFile, nextFile);
		}
	}
}

const rollover = () => {
	const logDir = path.join(__dirname, "../logs");

	if (!fs.existsSync(logDir))
		fs.mkdirSync(logDir, { recursive: true });

	const errLog = path.join(logDir, 'error.log');
	const accLog = path.join(logDir, 'access.log');

	rotateFiles(errLog, parseInt(process.env.MAX_ERRORS));
	fs.writeFile(
		errLog,
		'Timestamp,Status,URI,User,Error',
		(error) => {});

	rotateFiles(accLog, parseInt(process.env.MAX_ACCESS));
	fs.writeFile(
		accLog,
		'Timestamp,Status,URI,User',
		(error) => {});
};

rollover();

module.exports = {
	accessSite,
	rollover
}
