var redis = require('redis')
var Shorten = require('../lib');
var redisClient = redis.createClient();
var shorten = new Shorten(redisClient);

for (var i = 0; i < 20; i++){
  shorten.nextId(function(err, id){
      console.log(id);
  });
}

for (var i = 0; i < 20; i++){
  shorten.nextId32(function(err, id){
      console.log(id);
  });
}

for (var i = 0; i < 20; i++){
  shorten.nextId64(function(err, id){
      console.log(id);
  });
}

for (var i = 0; i < 10; i++){
  shorten.nextId('topic', function(err, id){
      console.log(id);
  });
}

for (var i = 0; i < 10; i++){
  shorten.nextId32('topic', function(err, id){
      console.log(id);
  });
}

for (var i = 0; i < 10; i++){
  shorten.nextId64('topic', function(err, id){
      console.log(id);
  });
}
