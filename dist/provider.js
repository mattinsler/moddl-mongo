(function() {
  var EventEmitter, MongoClient, Provider, mongodb, q;

  q = require('q');

  mongodb = require('mongodb');

  MongoClient = mongodb.MongoClient;

  EventEmitter = require('events').EventEmitter;

  Provider = new EventEmitter();

  Provider.cache = {
    connected: {},
    connecting: {}
  };

  Provider.get_database = function(db_url) {
    return Provider.connect({
      name: db_url
    });
  };

  Provider.get_collection = function(db_url, collection) {
    return Provider.get_database(db_url).then(function(db) {
      return db.collection(collection);
    });
  };

  Provider.connect = function(opts) {
    var d;
    if (opts.name == null) {
      opts.name = opts.url;
    }
    if (Provider.cache.connected[opts.name] != null) {
      return q(Provider.cache.connected[opts.name]);
    }
    if (Provider.cache.connecting[opts.name] != null) {
      return Provider.cache.connecting[opts.name];
    }
    d = q.defer();
    if ((opts.name != null) && (opts.url == null)) {
      Provider.on('connect:' + opts.name, function() {
        return d.resolve(Provider.cache.connected[opts.name]);
      });
      return d.promise;
    }
    Provider.cache.connecting[opts.name] = d.promise;
    MongoClient.connect(opts.url, function(err, db) {
      delete Provider.cache.connecting[opts.name];
      if (err != null) {
        return d.reject(err);
      }
      Provider.cache.connected[opts.name] = db;
      d.resolve(db);
      return Provider.emit('connect:' + opts.name);
    });
    return d.promise;
  };

  module.exports = Provider;

}).call(this);
