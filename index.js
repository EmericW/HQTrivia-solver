// temporary forever fix
setInterval(function() {
	console.log('timer that keeps nodejs processing running');
}, 1000 * 60 * 60);

const fs = require('fs');
const sharp = require('sharp');
const tesseract = require('tesseract.js');
const wiki = require('wikijs');
const https = require('https');
const SUBSCRIPTION_KEY = 'asdf';
const googleKey = 'AIzaSyCcqQ6yx0aVMrsHG7Zo86f_hJoOreAVMWg';

const newFileFound = filename => {
	sharp(filename)
		.extract({ left: 40, top: 250, width: 670, height: 650 })
		.toFile('testImages/tmp-crop.png', async err => {
			const result = await tesseract.recognize(`${__dirname}/testImages/tmp-crop.png`, {
				lang: 'eng',
			});
			// fs.unlinkSync('testImages/tmp-crop.png');
			const part = result.text.split('?');
			const q = part[0].split('\n').join(' ');
			const as = part[1].split('\n').filter(i => i);
			console.log(`Question: ${q}`);
			console.log('Answers: ');
			as.forEach((a, i) => console.log(`\t${i}: ${a}`));
			// const asdf = await wiki().search(q, 5);
			// console.log(asdf);
			let content = '';

			https.get(
				{
					hostname: 'www.google.com',
					path: '/search?q=' + encodeURIComponent(q),
				},
				res => {
					res.on('data', part => (content += part));
					res.on('end', () => {
						console.log(content.toLowerCase().match(/\bbusking\b/gm));
					});
					res.on('error', e => {
						throw e;
					});
				}
			);
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
newFileFound('testImages/test.png');
