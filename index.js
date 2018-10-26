// temporary forever fix
setInterval(function() {
	console.log('timer that keeps nodejs processing running');
}, 1000 * 60 * 60);

const fs = require('fs');
const sharp = require('sharp');
const tesseract = require('tesseract.js');

const newFileFound = filename => {
	sharp('test.png')
		.extract({ left: 40, top: 250, width: 670, height: 650 })
		.toFile('test-crop.png', function(err) {
			tesseract
				.recognize(`${__dirname}/test-crop.png`, {
					lang: 'eng',
				})
				.then(result => {
					const part = result.text.split('?');
					const q = part[0].split('\n').join(' ');
					const as = part[1].split('\n').filter(i => i);
					console.log(`Question: ${q}`);
					console.log('Answers: ');
					as.forEach((a, i) => console.log(`\t${i}: ${a}`));
				});
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
