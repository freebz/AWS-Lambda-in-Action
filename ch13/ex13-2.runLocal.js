// 리스트 13.2  runLocal(Node.js)

var lambdaFunction = require('./greetingsOnDemand');
var functionHandler = 'handler';

var event = {}; // { name: 'Danilo'};
var context = {};

function callback(error, data) {
    console.log(error);
    console.log(data);
}

lambdaFunction[functionHandler](event, context, callback);
