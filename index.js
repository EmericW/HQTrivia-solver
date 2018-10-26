// temporary forever fix
setInterval(function() {
	console.log('timer that keeps nodejs processing running');
}, 1000 * 60 * 60);

const fs = require('fs');
const sharp = require('sharp');
const tesseract = require('tesseract.js');

const newFileFound = filename => {
	console.log(filename);

	sharp('test.png')
		.extract({ left: 0, top: 0, width: 500, height: 500 })
		.toFile('test-crop.png', function(err) {
			console.log('error', err);
			console.log(`${__dirname}/test-crop.png`);
			tesseract
				.recognize(`${__dirname}/test-crop.png`, {
					lang: 'eng',
				})
				.then(result => console.log('result', result.text));
		});
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

// let files = getDirectoryFiles(__dirname);
// setInterval(() => watchForNewFile(__dirname), 1000);
newFileFound('test.png');
