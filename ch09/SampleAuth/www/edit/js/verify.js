AWS.config.region = 'ap-northeast-2';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'ap-northeast-2:0a534175-1c72-4e46-a764-cc1ce755d64a'
});

var lambda = new AWS.Lambda();

var result = document.getElementById('result');

function getUrlParams() {
  var p = {};
  var match,
    pl     = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query  = window.location.search.substring(1);
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
      FunctionName: 'sampleAuthVerifyUser',
      Payload: JSON.stringify(input)
    }, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
        var output = JSON.parse(data.Payload);
        if (output.verified) {
          result.innerHTML = 'User ' + input.email + ' has been <b>Verified</b>, thanks!';
        } else {
          result.innerHTML = 'User ' + input.email + ' has <b>not</b> been Verified, sorry.';
        }
      }
    });
  }
}

window.onload = init();
