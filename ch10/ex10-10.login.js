// 리스트 10.10  login.js(브라우저의 자바스크립트)

AWS.config.region = '<REGION>';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: '<IDENTITY_POOL_ID>'
});

var lambda = new AWS.Lambda();

function login() {

  var result = document.getElementById('result');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  result.innerHTML = 'Login...';

  if (email.value == null || email.value == '')  {
    result.innerHTML = 'Please specify your email address.';
  } else if (password.value == null || password.value == '') {
    result.innerHTML = 'Please specify a password.';
  } else {

    var input = {
      email: email.value,
      password: password.value
    };
    lambda.invoke({
      FunctionName: 'sampleAuthLogin',
      Payload: JSON.stringify(input)
    }, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
	var output = JSON.parse(data.Payload);
	if (!output.login) {
	  result.innerHTML = '<b>Not</b> logged in';
	} else {
	  result.innerHTML = 'Logged in with IdentityId: '
	    + output.identityId + '<br>';

	  var creds = AWS.config.credentials;
	  creds.params.IdentityId = output.identityId;
	  creds.params.Logins = {
	    'cognito-identity.amazonaws.com': output.token
	  };
	  creds.expired = true;

	  // 인증 역할을 가지고 무언가를 해야 한다.

	}
      }
    });
  }
}

var form = document.getElementById('dogin-form');
form.addEventListener('submit', function(evt) {
  evt.preventDefault();
  login();
});
