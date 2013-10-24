(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  module.exports = function(moddl) {
    var Model, q;
    q = moddl.q, Model = moddl.Model;
    return Model.Mongodb = (function(_super) {
      __extends(Mongodb, _super);

      function Mongodb() {
        return Mongodb.__super__.constructor.apply(this, [Model.Mongodb].concat(__slice.call(arguments)));
      }

      Mongodb.initialize = function(opts) {
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
            return Model.Mongodb.provider.get_collection(this.options.db, this.options.collection);
          }
        });
      };

      Mongodb.load = function(instance, data) {
        var k, v, _results;
        _results = [];
        for (k in data) {
          v = data[k];
          _results.push(instance[k] = v);
        }
        return _results;
      };

      Mongodb.connect = function(url) {
        return Model.Mongodb.provider.connect({
          name: 'DEFAULT',
          url: url
        });
      };

      Mongodb.where = function() {
        var _ref;
        return (_ref = new this.Query(this)).where.apply(_ref, arguments);
      };

      Mongodb.sort = function() {
        var _ref;
        return (_ref = this.where()).sort.apply(_ref, arguments);
      };

      Mongodb.skip = function() {
        var _ref;
        return (_ref = this.where()).skip.apply(_ref, arguments);
      };

      Mongodb.limit = function() {
        var _ref;
        return (_ref = this.where()).limit.apply(_ref, arguments);
      };

      Mongodb.fields = function() {
        var _ref;
        return (_ref = this.where()).fields.apply(_ref, arguments);
      };

      Mongodb.first = function() {
        var _ref;
        return (_ref = this.where()).first.apply(_ref, arguments);
      };

      Mongodb.array = function() {
        var _ref;
        return (_ref = this.where()).array.apply(_ref, arguments);
      };

      Mongodb.count = function() {
        var _ref;
        return (_ref = this.where()).count.apply(_ref, arguments);
      };

      Mongodb.save = function(obj, opts, callback) {
        return this.where().save(obj, opts, callback);
      };

      Mongodb.update = function(query, update, opts, callback) {
        return this.where(query).update(update, opts, callback);
      };

      Mongodb.remove = function(query, opts, callback) {
        return this.where(query).remove(opts, callback);
      };

      Mongodb.find_and_modify = Model.defer(function(query, sort, update, opts) {
        var _this = this;
        if (opts == null) {
          opts = {};
        }
        return this.__collection__.then(function(c) {
          return q.ninvoke(c, 'findAndModify', query, sort, update, opts);
        }).then(Model.wrapper(this));
      });

      return Mongodb;

    })(Model);
  };

}).call(this);
