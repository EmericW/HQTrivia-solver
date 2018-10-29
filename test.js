const data = require('./data.json');
const solve = require('./Solver');

data.forEach(question => {
	solve(question.question, question.answers, answer => {
		console.log(answer);
	});
});
