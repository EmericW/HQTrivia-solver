const https = require('https');
const events = require('events');
const request = require('request');
const { parse } = require('node-html-parser');

const calculatePercentages = answers => {
	let total = 0;
	Object.keys(answers).forEach(key => {
		total += answers[key] || 0;
	});
	Object.keys(answers).forEach(key => {
		answers[key] = (answers[key] / total || 0) * 100;
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
			.map(e => e.attributes.href.substr(7).split('&')[0])
			.slice(1, top + 1);
		callback(null, searchResults);
	});
};

const scoreContent = (content, target, callback) => {
	const regex = new RegExp(`${target.toLowerCase()}`, 'g');
	const matches = content.toLowerCase().match(regex);
	return (matches && matches.length) || 0;
};

const searchByAnswers = (question, answers, callback) => {
	let count = 0;
	let scores = {};

	answers.forEach(answer => {
		getTopSearchResults(answer, 5, (err, results) => {
			results.forEach(link => {
				resolveUrl(link, (err, content = '') => {
					const score = scoreContent(content, question);
					if (!scores[answer]) {
						scores[answer] = score;
					}
					scores[answer] += score;

					count++;
					if (count === 16) {
						callback(scores);
					}
				});
			});
		});
	});
};

const searchByQuestion = (question, answers, callback) => {
	let count = 0;
	let scores = {};

	getTopSearchResults(question, 5, (err, results) => {
		results.forEach(link => {
			resolveUrl(link, (err, content = '') => {
				answers.forEach(answer => {
					const score = scoreContent(content, answer);

					if (!scores[answer]) {
						scores[answer] = score;
					}
					scores[answer] += score;

					count++;
					if (count >= 15) {
						callback(scores);
					}
				});
			});
		});
	});
};

const solve = (question, answers, callback) => {
	const emitter = new events.EventEmitter();
	const probabilities = {};
	answers.forEach(a => (probabilities[a] = 0));
	searchByQuestion(question, answers, result => {
		emitter.emit('data', calculatePercentages(result));
	});
	searchByAnswers(question, answers, result => {
		emitter.emit('data', calculatePercentages(result));
	});
	callback(emitter);
};

module.exports = solve;
