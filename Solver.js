const https = require('https');
const request = require('request');
const { parse } = require('node-html-parser');

const calculatePercentages = answers => {
	let total = 0;
	Object.keys(answers).forEach(key => {
		total += answers[key];
	});
	Object.keys(answers).forEach(key => {
		answers[key] = (answers[key] / total) * 100;
	});
	return answers;
};

const resolveUrl = (url, callback) => {
	let content = '';
	request(url, (error, response, body) => {
		if (error) {
			callback(error);
		}
		callback(null, body);
	});
};

const getTopSearchResults = (question, top, callback) => {
	resolveUrl(`https://www.google.com/search?q=${encodeURIComponent(question)}`, (error, content) => {
		const dom = parse(content);
		const searchResults = dom
			.querySelectorAll('.r a')
			.map(e => e.attributes.href.substr(7))
			.slice(0, top);
		callback(null, searchResults);
	});
};

const solve = (question, answers, callback) => {
	const result = {};
	answers.forEach(a => (result[a] = 0));
	let count = 0;
	getTopSearchResults(question, 5, (err, results) => {
		results.forEach(link => {
			resolveUrl(link.split('&')[0], (err, content) => {
				answers.forEach(answer => {
					let score = 0;
					const expresion = `${answer.toLowerCase()}`;
					const regex = new RegExp(expresion, 'g');
					const matches = content.toLowerCase().match(regex);
					result[answer] += (matches && matches.length) || 0;
					count++;
					if (count >= 15) {
						callback(calculatePercentages(result));
					}
				});
			});
		});
	});
};

module.exports = solve;
