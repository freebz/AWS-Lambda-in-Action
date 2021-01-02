// 리스트 5.6  purgeBucketByPrefix(Node.js)

var AWS = require('aws-sdk');
var util = require('util');

var s3 = new AWS.S3();

var dstBucket = '<BUCKET-NAME>';
var dstPrefix = 'tmp/';
var maxElapsedInSeconds = 3600;

var dstPrefixLength = dstPrefix.length;

function checkIfFinished(state, callback) {
  if (state.processed == state.found && !state.searching) {
    callback(null, state.deleted + " objects deleted");
  }
}

function getObjectKeys(marker, state, callback) {
  var params = {
    Bucket: dstBucket,
    Prefix: dstPrefix
  };
  if (marker !== null) {
    params.Marker = marker;
  }
  console.log(params);
  s3.listObjects(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // 오류 발생시
      callback(err);
    } else {
      state.found += data.Contents.length;
      if (data.IsTruncated) {
	getObjectKeys(data.Nextmarker, state, callback);
      } else {
	state.searching = false;
      }
      if (data.Contents.length === 0) {
	checkIfFinished(state, callback);
      }
      data.Contents.forEach(function(item) {
	var fileName = item.Key;
	var fileDate = new Date(
	  fileName.substr(dstPrefixLength,4),
	  fileName.substr(dstPrefixLength + 4,2) - 1,
	  fileName.substr(dstPrefixLength + 6,2),
	  fileName.substr(dstPrefixLength + 8,2),
	  fileName.substr(dstPrefixLength + 10,2),
	  fileName.substr(dstPrefixLength + 12,2)
	);
	var elapsedInSeconds = (now - fileDate) / 1000;
	if (elapsedInSeconds > maxElapsedInSeconds) {
	  var params = {
	    Bucket: dstBucket,
	    Key: fileName
	  };
	  s3.deleteObject(params, function(err, data) {
	    if (err) {
	      console.log(err, err.stack);
	      console.fail(err);
	    } else {
	      console.log('Deleted ' + fileName);
	      state.deleted++;
	    }
	    state.processed++;
	    checkIfFinished(state, callback);
	  });
	} else {
	  state.processed++;
	  checkIfFinished(state, callback);
	}
      });
    }
  });
}

exports.handler = (event, context, callback) => {
  console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));

  now = new Date();
  console.log('Now is ' + now.toISOString());

  var state = {
    found: 0,
    processed: 0,
    deleted: 0,
    searching: true
  };

  getObjectKeys(null, state, callback);
};
