// 리스트 10.11  login 람다 함수(Node.js)

console.log('Loading function');

var AWS = require('aws-sdk');
var config = require('./config.json');
var cryptoUtils = require('./lib/cryptoUtils');

var dynamodb = new AWS.DynamoDB();
var cognitoidentity = new AWS.CognitoIdentity();
function getUser(email, fn) {
  dynamodb.getItem({
    TableName: config.DDB_TABLE,
    Key: {
      email: {
	S: email
      }
    }
  }, function(err, data) {
    if (err) return fn(err);
    else {
      if ('Item' in data) {
	var hash = data.Item.passwordHash.S;
	var salt = data.Item.passwordSalt.S;
	var verified = data.Item.verified.BOOL;
	fn(null, hash, salt, verified);
      } else {
	fn(null, null); // 사용자가 검색되지 않음.
      }
    }
  });
}

function getToken(email, fn) {
  var param = {
    IdentiPoolId: config.IDENTITY_POOL_ID,
    Logins: {}
  };
  param.Logins[config.DEVELOPER_PROVIDER_NAME] = email;
  cognitoidentity.getOpenIdTokenForDeveloperIdentity(param, function(err, data) {
    if (err) return fn(err);
    else fn(null, data.IdentityId, data.Token);
  });
}

exports.handler = (event, context, callback) => {
  var email = event.email;
  var clearPassword = event.password;

  getUser(email, function(err, correctHash, salt, verified) {
    if (err) {
      callback('Error in getUser: ' + err);
    } else {
      if (correctHash == null) {
	// 사용자가 검색되지 않음.
	console.log('User not found: ' + email);
	callback(null, { login: false });
      } else if (!verified) {
	// 사용자가 확인되지 않음.
	console.log('User not verified: ' + email);
	callback(null, { login: false });
      } else {
	cryptoUtils.computeHash(clearPassword, salt, function(err, salt, hash) {
	  if (err) {
	    callback('Error in hash: ' + err);
	  } else {
	    console.log('correctHash: ' + correctHash + ' hash: ' + hash);
	    if (hash == correctHash) {
	      // 로그인 성공
	      console.log('User logged in: ' + email);
	      getToken(email, function(err, identityId, token) {
		if (err) {
		  callback('Error in getToken: ' + err);
		} else {
		  callback(null, {
		    login: true,
		    identityId: identityId,
		    token: token
		  });
		}
	      });
	    } else {
	      // 로그인 실패
	      console.log('User login failed: ' + email);
	      callback(null, { login: false });
	    }
	  }
	});
      }
    }
  });
}
