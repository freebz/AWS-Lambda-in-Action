AWS.config.region = 'ap-northeast-2';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'ap-northeast-2:0a534175-1c72-4e46-a764-cc1ce755d64a'
});

var lambda = new AWS.Lambda();

function signup() {

  var result = document.getElementById('result');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var verifyPassword = document.getElementById('verify-password');

  result.innerHTML = 'Sign Up...';

	if (email.value == null || email.value == '') {
  	result.innerHTML = 'Please specify your email address.';
  } else if (password.value == null || password.value == '') {
    result.innerHTML = 'Please specify a password.';
  } else if (password.value != verifyPassword.value) {
    result.innerHTML = 'Passwords are <b>different</b>, please check.';
  } else {

    var input = {
      email: email.value,
      password: password.value,
    };

    lambda.invoke({
      FunctionName: 'sampleAuthCreateUser',
      Payload: JSON.stringify(input)
    }, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
        var output = JSON.parse(data.Payload);
        if (output.created) {
          result.innerHTML = 'User ' + input.email + ' created. Please check your email to validate the user and enable login.';
        } else {
          result.innerHTML = 'User <b>not</b> created.';
        }
      }
    });

  }
}

var form = document.getElementById('signup-form');
form.addEventListener('submit', function(evt) {
  evt.preventDefault();
  signup();
});
