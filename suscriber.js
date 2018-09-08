var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');
 
client.on('connect', function () {
  //订阅presence主题
  client.subscribe('presence');
  //向presence主题发布消息
 // client.publish('presence', 'Hello mqtt');
});
 
client.on('message', function (topic, message) {
  //收到的消息是一个Buffer
  console.log(message.toString());
  client.end();
});
