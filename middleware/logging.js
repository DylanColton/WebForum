const path	= require("path");
const fs	= require("fs").promises;

require("dotenv").config();

const accessSite = async (status, uri, user, err) => {
	const timestamp = (new Date(Date.now())).toISOString();
	const logsDir	= path.join(__dirname, `../logs/`);

	try {
		await fs.mkdir(logsDir, { recursive: true });

		if (err) {
			await fs.appendFile(
				path.join(logsDir, "error.log"),
				`${timestamp},${status},${uri},${user},${err}\n`
			);
		}
		await fs.appendFile(
			path.join(logsDir, 'access.log'),
			`${timestamp},${status},${uri},${user}\n`
		);	
	} catch (err) {
		console.log(err);
	}
};

async function rotateFiles(logFile, maxFiles) {
    for (let i = maxFiles - 1; i >= 0; i--) {
        const currentFile = i === 0 ? logFile : `${logFile}.${i}`;
        const nextFile = `${logFile}.${i + 1}`;

        try {
            await fs.access(currentFile);
            if (i + 1 === maxFiles) {
                await fs.unlink(nextFile).catch(() => {});
            }
            await fs.rename(currentFile, nextFile);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(`Error rotating log files: ${err}`);
            }
        }
    }
}

const rollover = async () => {
    const logDir = path.join(__dirname, "../logs");

    try {
        await fs.mkdir(logDir, { recursive: true });
    } catch (err) {
        console.error(`Error creating log directory: ${err}`);
        return;
    }

    const errLog = path.join(logDir, 'error.log');
    const accLog = path.join(logDir, 'access.log');

    const maxErrors = parseInt(process.env.MAX_ERRORS) || 5;
    const maxAccess = parseInt(process.env.MAX_ACCESS) || 5;

    await rotateFiles(errLog, maxErrors);
    await fs.writeFile(errLog, 'Timestamp,Status,URI,User,Error\n');

    await rotateFiles(accLog, maxAccess);
    await fs.writeFile(accLog, 'Timestamp,Status,URI,User\n');
};

module.exports = {
	accessSite,
	rollover
};
