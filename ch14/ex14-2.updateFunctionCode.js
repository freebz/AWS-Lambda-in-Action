// 리스트 14.2  updateFunctionCode(Node.js)

var lambda = new AWS.Lambda();
var params = {
    FunctionName: 'anotherGreetingsOnDemand',
    S3Bucket: 'danilop-functions',
    S3Key: 'code/greetingsOnDemand-v2.zip'
    Publish: true,
};
lambda.updateFunctionCode(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else     console.log(data);
});
