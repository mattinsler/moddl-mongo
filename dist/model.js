(function() {
  var Model, q,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  q = require('moddl/node_modules/q');

  Model = require('moddl').Model;

  Model.Mongo = (function(_super) {
    __extends(Mongo, _super);

    function Mongo() {
      return Mongo.__super__.constructor.apply(this, [Model.Mongo].concat(__slice.call(arguments)));
    }

    Mongo.initialize = function(opts) {
      var k, v;
      this.options = {};
      if (typeof opts === 'string') {
        this.options.collection = opts;
        this.options.db = 'DEFAULT';
      } else {
        for (k in opts) {
          v = opts[k];
          this.options[k] = v;
        }
      }
      return Object.defineProperty(this, '__collection__', {
        enumerable: true,
        get: function() {
          return Model.Mongo.provider.get_collection(this.options.db, this.options.collection);
        }
      });
    };

    Mongo.load = function(instance, data) {
      var k, v, _results;
      _results = [];
      for (k in data) {
        v = data[k];
        _results.push(instance[k] = v);
      }
      return _results;
    };

    Mongo.connect = function(url) {
      return Model.Mongo.provider.connect({
        name: 'DEFAULT',
        url: url
      });
    };

    Mongo.where = function() {
      var _ref;
      return (_ref = new this.Query(this)).where.apply(_ref, arguments);
    };

    Mongo.sort = function() {
      var _ref;
      return (_ref = this.where()).sort.apply(_ref, arguments);
    };

    Mongo.skip = function() {
      var _ref;
      return (_ref = this.where()).skip.apply(_ref, arguments);
    };

    Mongo.limit = function() {
      var _ref;
      return (_ref = this.where()).limit.apply(_ref, arguments);
    };

    Mongo.fields = function() {
      var _ref;
      return (_ref = this.where()).fields.apply(_ref, arguments);
    };

    Mongo.first = function() {
      var _ref;
      return (_ref = this.where()).first.apply(_ref, arguments);
    };

    Mongo.array = function() {
      var _ref;
      return (_ref = this.where()).array.apply(_ref, arguments);
    };

    Mongo.count = function() {
      var _ref;
      return (_ref = this.where()).count.apply(_ref, arguments);
    };

    Mongo.save = function(obj, opts, callback) {
      return this.where().save(obj, opts, callback);
    };

    Mongo.update = function(query, update, opts, callback) {
      return this.where(query).update(update, opts, callback);
    };

    Mongo.remove = function(query, opts, callback) {
      return this.where(query).remove(opts, callback);
    };

    Mongo.find_and_modify = Model.defer(function(query, sort, update, opts) {
      var _this = this;
      if (opts == null) {
        opts = {};
      }
      return this.__collection__.then(function(c) {
        return q.ninvoke(c, 'findAndModify', query, sort, update, opts);
      }).then(Model.wrapper(this));
    });

    return Mongo;

  })(Model);

}).call(this);
