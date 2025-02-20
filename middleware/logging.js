const path	= require("path");
const fs	= require("fs");

require("dotenv").config();

const accessSite = async (status, uri, user, err) => {
	const timestamp = new Date().toISOString();
	if (err) {
		await fs.append(
			__dirname+'/logs/error.log',
			`${timestamp},${status},${uri},${user},${err}`,
			(error) => {});
	}
	await fs.appendFile(
		__dirname+'/logs/access.log',
		`${timestamp},${status},${uri},${user}`,
		(error) => {});
};

async function rotateFiles(logFile, maxFiles) {
	for (let i = maxFiles - 1; i >= 0; i--) {
		const currentFile = i === 0 ? logFile : `${logFile}.${i}`;
		const nextFile = `${logFile}.${i+1}`;

		if (await fs.existsSync(currentFile)) {
			if (i + 1 == maxFiles)
				await fs.unlinkSync(nextFile);
			await fs.renameSync(currentFile, nextFile);
		}
	}
}

const rollover = async () => {
	const logDir = path.join(__dirname, "../logs");

	if (!(await fs.existsSync(logDir)))
		fs.mkdirSync(logDir, { recursive: true });

	const errLog = path.join(logDir, 'error.log');
	const accLog = path.join(logDir, 'access.log');

	await rotateFiles(errLog, parseInt(process.env.MAX_ERRORS));
	await fs.writeFile(
		errLog,
		'Timestamp,Status,URI,User,Error',
		(error) => {});

	await rotateFiles(accLog, parseInt(process.env.MAX_ACCESS));
	await fs.writeFile(
		accLog,
		'Timestamp,Status,URI,User',
		(error) => {});
};

module.exports = {
	accessSite,
	rollover
}
