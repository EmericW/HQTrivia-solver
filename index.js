require('dotenv').config();
const fs = require('fs');
const sharp = require('sharp');
const tesseract = require('tesseract.js');

const FileWatcher = require('./FileWatcher');
const solve = require('./Solver');

const { SCREENSHOT_PATH, TESSERACT_LANG } = process.env;

const fileWatcher = new FileWatcher(SCREENSHOT_PATH);
fileWatcher.on('newFile', payload => {
	newFileFound(payload);
});

const newFileFound = filename => {
	// reset terminal
	process.stdout.write('\033c');
	console.log('Processing...');
	// crop image
	sharp(SCREENSHOT_PATH + '/' + filename)
		.extract({ left: 40, top: 500, width: 670, height: 1334 - 500 })
		.toFile(`${__dirname}/tmp-crop.PNG`, async err => {
			// extract text from image
			const result = await tesseract.recognize(`${__dirname}/tmp-crop.png`, {
				lang: TESSERACT_LANG,
			});
			// remove cropped image
			fs.unlinkSync(`${__dirname}/tmp-crop.png`);

			const part = result.text.split('?');
			const q = part[0].split('\n').join(' ');
			const a = part[1].split('\n').filter(i => i && i.length > 3);
			a.splice(0, 1);
			console.log(`Question: ${q}`);

			// get the answer
			solve(q, a, emitter => {
				emitter.on('data', data => {
					console.log('----------------------------------------');
					Object.keys(data).map(key => console.log(`- ${key}: ${data[key]}%`));
					console.log('----------------------------------------');
				});
			});
		});
};
