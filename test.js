const data = require('./data.json');
const solve = require('./Solver');

// data.forEach(question => {
// 	solve(question.question, question.answers, answer => {
// 		console.log(answer);
// 	});
// });

solve(data[0].question, data[0].answers, emitter => {
	emitter.on('data', data => {
		console.log(data);
	});
});
