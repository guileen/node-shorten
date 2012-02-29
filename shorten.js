var MAP_64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-';

var Shorten = function(redisClient, prefix) {
  this.redisClient = redisClient;
  this.prefix = prefix || 'shorten';
};

var exports = module.exports = function(redisClient, prefix) {
  return new Shorten(redisClient, prefix);
}

var id = exports.id = function(value) {
  var quotient, remainder, result = '';
  do {
    quotient = Math.floor(value / 62);
    remainder = value - quotient * 62;
    value = quotient;
    result = MAP_64[remainder] + result;
  } while (value > 0);
  return result;
};

var id32 = exports.id32 = function(value) {
  var quotient, remainder, result = '';
  do {
    quotient = value >> 5;
    remainder = value & 0x1f;
    value = quotient;
    result = MAP_64[remainder] + result;
  } while (value > 0);
  return result;
};

var id64 = exports.id64 = function(value) {
  var quotient, remainder, result = '';
  do {
    quotient = value >> 6;
    remainder = value & 0x3f;
    value = quotient;
    result = MAP_64[remainder] + result;
  } while (value > 0);
  return result;
};

Shorten.prototype = {

  nextNum: function(key, fn) {
    if (typeof fn === 'undefined') {
      fn = key;
      key = 'default';
    }
    this.redisClient.incr(this.prefix + '-id-' + key, fn)
  },

  _nextId: function(key, fn, idFn) {
    if (typeof fn === 'undefined') {
      fn = key;
      key = 'default';
    }
    this.redisClient.incr(this.prefix + '-id-' + key, function(err, val) {
        if (err) {
          fn(err);
        } else {
          try {
            var v = idFn(val);
            fn(null, v);
          } catch(err) {
            fn(err)
          }
        }
    });
  },

  nextId: function(key, fn) {
    this._nextId(key, fn, id);
  },

  nextId32: function(key, fn) {
    this._nextId(key, fn, id32);
  },

  nextId64: function(key, fn) {
    this._nextId(key, fn, id64);
  }

};

