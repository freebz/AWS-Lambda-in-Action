// 리스트 7.3  greetings.js(브라우저의 자바스크립트)

AWS.config.region = '<REGION>';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: '<IDENTITY-POOL-ID>',
});

var lambda = new AWS.Lambda();

function returnGreetings() {
  document.getElementById('submitButton').disabled = true;
  var name = document.getElementById('name');
  var input;
  if (name.value == null || name.value == '') {
    input = {};
  } else {
    input = {
      name: name.value
    };
  }
  lambda.invoke({
    FunctionName: 'greetingsOnDemand',
    Payload: JSON.stringify(input)
  }, function(err, data) {
    var result = document.getElementById('result');
    if (err) {
      console.log(err, err.stack);
      result.innerHTML = err;
    } else {
      var output = JSON.parse(data.Payload);
      result.innerHTML = output;
    }
    document.getElementById('submitButton').disabled = false;
  });
}
var form = document.getElementById('greetingsForm');
form.addEventListener('submit', function(evt) {
  evt.preventDefault();
  returnGreetings();
});
