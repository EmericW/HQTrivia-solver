require('dotenv').config();
const fs = require('fs');
const sharp = require('sharp');
const tesseract = require('tesseract.js');

const FileWatcher = require('./FileWatcher');
const solve = require('./Solver');

const fileWatcher = new FileWatcher(process.env.SCREENSHOT_PATH);
fileWatcher.on('newFile', payload => {
	newFileFound(payload);
});

const newFileFound = filename => {
	sharp(filename)
		.extract({ left: 40, top: 250, width: 670, height: 650 })
		.toFile(`${process.env.SCREENSHOT_PATH}/tmp-crop.png`, async err => {
			const result = await tesseract.recognize(`${process.env.SCREENSHOT_PATH}/tmp-crop.png`, {
				lang: 'eng',
			});
			fs.unlinkSync(`${process.env.SCREENSHOT_PATH}/tmp-crop.png`);
			const part = result.text.split('?');
			const q = part[0].split('\n').join(' ');
			const as = part[1].split('\n').filter(i => i);
			console.log(`Question: ${q}`);
			console.log('Answers: ');
			as.forEach((a, i) => console.log(`\t${i}: ${a}`));
			// const asdf = await wiki().search(q, 5);
			solve(q, a, answer => {
				console.log(answer);
			});
		});
};
