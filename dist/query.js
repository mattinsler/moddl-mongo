(function() {
  var Model;

  Model = require('moddl').Model;

  Model.Mongo.Query = (function() {
    function Query(model) {
      this.model = model;
      this.query = {};
      this.opts = {};
    }

    Query.prototype.where = function(query) {
      var k, v;
      if (query == null) {
        query = {};
      }
      for (k in query) {
        v = query[k];
        this.query[k] = v;
      }
      return this;
    };

    Query.prototype.sort = function(sort) {
      this.opts.sort = sort;
      return this;
    };

    Query.prototype.skip = function(skip) {
      this.opts.skip = skip;
      return this;
    };

    Query.prototype.limit = function(limit) {
      this.opts.limit = limit;
      return this;
    };

    Query.prototype.fields = function(fields) {
      this.opts.fields = fields;
      return this;
    };

    Query.prototype.first = Model.defer(function(callback) {
      var _this = this;
      this.model.__collection__.then(function(c) {
        return c.find(_this.query, _this.opts).nextObject(Model.wrap_callback(_this.model, callback));
      })["catch"](callback);
      return null;
    });

    Query.prototype.array = Model.defer(function(callback) {
      var _this = this;
      this.model.__collection__.then(function(c) {
        return c.find(_this.query, _this.opts).toArray(Model.wrap_callback(_this.model, callback));
      })["catch"](callback);
      return null;
    });

    Query.prototype.count = Model.defer(function(callback) {
      var _this = this;
      this.model.__collection__.then(function(c) {
        return c.count(_this.query, callback);
      })["catch"](callback);
      return null;
    });

    Query.prototype.save = Model.defer(function(obj, opts, callback) {
      var k, save_obj, v, _ref,
        _this = this;
      if (typeof obj === 'function') {
        callback = obj;
        opts = {};
        obj = {};
      }
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
      save_obj = {};
      for (k in obj) {
        v = obj[k];
        if (Object.getOwnPropertyDescriptor(obj, k).get == null) {
          save_obj[k] = v;
        }
      }
      _ref = this.query;
      for (k in _ref) {
        v = _ref[k];
        if (Object.getOwnPropertyDescriptor(this.query, k).get == null) {
          save_obj[k] = v;
        }
      }
      this.model.__collection__.then(function(c) {
        return c.save(save_obj, opts, Model.wrap_callback(_this.model, callback));
      })["catch"](callback);
      return null;
    });

    Query.prototype.update = Model.defer(function(update, opts, callback) {
      var _this = this;
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
      this.model.__collection__.then(function(c) {
        return c.update(_this.query, update, opts, callback);
      })["catch"](callback);
      return null;
    });

    Query.prototype.remove = Model.defer(function(opts, callback) {
      var _this = this;
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
      this.model.__collection__.then(function(c) {
        return c.remove(_this.query, opts, callback);
      })["catch"](callback);
      return null;
    });

    return Query;

  })();

}).call(this);
