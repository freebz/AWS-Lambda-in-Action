// 리스트 9.2  cryptoUtils.js 공유 라이브러리(Node.js)

var crypto = require('crypto');

function computeHash(password, salt, fn) {
  var len = 512;
  var iterations = 4096;
  var digest = 'sha512';

  if (3 == arguments.length) {
    crypto.pbkdf2(password, salt, iterations, len, digest, function(err, derivedKey) {
      if (err) return fn(err);
      else fn(null, salt, derivedKey.toString('base64'));
    });
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt) {
      if (err) return fn(err);
      salt = salt.toString('base64');
      computeHash(password, salt, fn);
    });
  }
}

module.exports.computeHash = computeHash;
