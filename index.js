const fs = require('fs');

const newFileFound = filename => {
	console.log(filename);
};

const getDirectoryFiles = path => {
	return fs.readdirSync(path);
};

const watchForNewFile = path => {
	const newFiles = getDirectoryFiles(path);
	newFiles.forEach(file => {
		if (!files.includes(file)) {
			files = newFiles;
			newFileFound(file);
		}
	});
};

let files = getDirectoryFiles(__dirname);
setInterval(() => watchForNewFile(__dirname), 1000);
