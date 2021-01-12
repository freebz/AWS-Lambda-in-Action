// 리스트 11.5  contentUpdated 람다 함수(Node.js)

var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var util = require('util');
var AWS = require('aws-sdk');

var DDB_TABLE = '<DYNAMODB_TABLE>';
var MAX_WIDTH = 200;
var MAX_HEIGHT = 200;

var s3 = new AWS.S3();
var dynamodb = new AWS.DynamoDB();

function startsWith(text, prefix) {
  return (text.lastIndexOf(prefix, 0) === 0)
}

exports.handler = (event, context, callback) => {
  console.log('Reading options from event:\n',
    util.inspect(event, {depth: 5}));
  var srcBucket = event.Records[0].s3.bucket.name;
  var srcKey = unescape(event.Records[0].s3.object.key);
  var eventName = event.Records[0].eventName;
  var eventTime = event.Records[0].eventTime;
  var dstBucket = srcBucket;
  var dstKey = srcKey.replace(/content/, 'thumbnail');
  var identityId = srcKey.match(/.*\/content\/([^\/*)/)[1];

  console.log('eventName = ' + eventName);
  console.log('dstKey = ' + dstKey);
  console.log('identityId = ' + identityId);

  if (startsWith(eventName, 'ObjectRemoved')) {
    s3.deleteObject({
      Bucket: dstBucket,
      Key: dstKey
    }, function(err, data) {
      if (err) console.log(err);
      else console.log(data);
    });

    dynamodb.deleteItem({
      TableName: DDB_TABLE,
      Key: {
	identityId: { S: identityId },
	objectKey: { S: srcKey }
      }
    }, function(err, data) {
      if (err) console.log(err);
      else console.log(data);
    });

  } else {

    var typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
      callback('Unable to infer image type for key ' + srcKey);
    }
    var imageType = typeMatch[1];
    if (imageType != 'jpg' && imageType != 'png' && imageType != 'gif') {
      callback('Skipping non-image ' + srcKey);
    }

    async.waterfall([
      function download(next) {
	// S3에서 이미지를 버퍼로 다운로드한다.
	s3.getObject({
	  Bucket: strBucket,
	  Key: srcKey
	},
        next);
      },
      function transform(response, next) {
	gm(response.Body).size(function(err, size) {
	  var scalingFactor = Math.min(
	    MAX_WIDTH / size.width,
	    MAX_HEIGHT / size.height
	  );
	  var width = scalingFactor * size.width;
	  var height = scalingFactor * size.height;

	  this.resize(width, height)
	    .toBuffer(imageType, function(err, buffer) {
	      if (err) {
		next(err);
	      } else {
		next(null, response.ContentType,
		  response.Metadata.data, buffer);
	      }
	    });
	});
      },
      function upload(contentType, metadata, data, next) {
	s3.putObject({
	  Bucket: dstBucket,
	  Key: dstKey,
	  Body: data,
	  ContentType: contentType
	}, function(err, buffer) {
	  if (err) {
	    next(err);
	  } else {
	    next(null, metadata);
	  }
	});
      },
      function index(metadata, next) {
	var json_metadata = JSON.parse(metadata);
	var params = {
	  TableName: DDB_TABLE,
	  Item: {
	    identityId: { S: identityId },
	    objectKey: { S: srcKey },
	    thumbnailKey: { S: dstKey },
	    isPublic: { BOOL: json_metadata.isPublic },
	    uploadDate: { S: eventTime },
	    uploadDay: { S: eventTime.substr(0, 10) },
	    title: { S: json_metadata.title },
	    description: { S: json_metadata.description }
	  }
	};
	dynamodb.putItem(params, next);
      }], function (err) {
	if (err) console.log(err, err.stack);
	else console.log('Ok');
      }
    );
  }
}
