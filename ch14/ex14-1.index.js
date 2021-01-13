// 리스트 14.1  greetingsOnDemand 함수를 위한 index.js(Node.js)

console.log('Loading function');

exports.handler = (event, context, callback) => {
    console.log('Received event:',
	JSON.stringify(event, null, 2));
    console.log('name =', event.name);
    var name = '';
    if ('name' in event) {
	name = event['name'];
    } else {
	name = "World";
    }
    var greetings = 'Hello ' + name + '!';
    console.log(greetings);
    callback(null, greetings);
};
