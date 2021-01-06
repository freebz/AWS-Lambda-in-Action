// 리스트 9.10  verify.js(브라우저에서의 자바스크립트)

AWS.config.region = '<REGION>';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: '<IDENTITY_POOL_ID>'
});

var lambda = new AWS.Lambda();

var result = document.getElementById('result');

function getUrlParams() {
  var p = {};
  var match,
      pl = /\+/g,
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query = window.location.search.substring(1);
  while (match = search.exec(query))
    p[decode(match[1])] = decode(match[2]);
  return p;
}

function init() {
  var urlParams = getUrlParams();
  if (!('email' in urlParams) || !('verify' in urlParams)) {
    result.innerHTML = 'Please specify email and verify token in the URL.';
  } else {
    result.innerHTML = 'Verifying...';
    var input = {
      email: urlParams['email'],
      verify: urlParams['verify']
    };
    lambda.invoke({
      FunctionName: 'smapleAuthVerifyUser',
      Payload: JSON.stringify(input)
    }, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
	var output = JSON.parse(data.Payload);
	if (output.verified) {
	  result.innerHTML = 'User ' + input.email +
	            ' has been <b>Verified</b>, thanks!';
	} else {
	  result.innerHTML = 'User ' + input.email +
	            ' has <b>not</b> been Verified, sorry.';
	}
      }
    });
  }
}

window.onload = init();
