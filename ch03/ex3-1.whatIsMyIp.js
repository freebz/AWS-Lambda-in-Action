// 리스트 3.1  whatIsMyIp (Node.js) 함수

exports.handler = (event, context, callback) => {
  callback(null, event.myip);
};
