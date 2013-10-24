(function() {
  module.exports = function(moddl) {
    var Model, q;
    q = moddl.q, Model = moddl.Model;
    return Model.Mongodb.Query = (function() {
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

      Query.prototype.first = Model.defer(function() {
        var _this = this;
        return this.model.__collection__.then(function(c) {
          return q.ninvoke(c.find(_this.query, _this.opts), 'nextObject');
        }).then(Model.wrapper(this.model));
      });

      Query.prototype.array = Model.defer(function() {
        var _this = this;
        return this.model.__collection__.then(function(c) {
          return q.ninvoke(c.find(_this.query, _this.opts), 'toArray');
        }).then(Model.wrapper(this.model));
      });

      Query.prototype.count = Model.defer(function() {
        var _this = this;
        return this.model.__collection__.then(function(c) {
          return q.ninvoke(c.find(_this.query, _this.opts), 'count');
        });
      });

      Query.prototype.save = Model.defer(function(obj, opts) {
        var k, save_obj, v, _ref, _ref1, _ref2,
          _this = this;
        if (obj == null) {
          throw new Error('Cannot save null object');
        }
        if (opts == null) {
          opts = {};
        }
        save_obj = {};
        for (k in obj) {
          v = obj[k];
          if (((_ref = Object.getOwnPropertyDescriptor(obj, k)) != null ? _ref.value : void 0) != null) {
            save_obj[k] = v;
          }
        }
        _ref1 = this.query;
        for (k in _ref1) {
          v = _ref1[k];
          if (((_ref2 = Object.getOwnPropertyDescriptor(this.query, k)) != null ? _ref2.value : void 0) != null) {
            save_obj[k] = v;
          }
        }
        return this.model.__collection__.then(function(c) {
          return q.ninvoke(c, 'save', save_obj, opts);
        }).then(function() {
          return Model.wrapper(_this.model)(save_obj);
        });
      });

      Query.prototype.update = Model.defer(function(update, opts) {
        var _this = this;
        if (opts == null) {
          opts = {};
        }
        return this.model.__collection__.then(function(c) {
          return q.ninvoke(c, 'update', _this.query, update, opts);
        }).then(Model.wrapper(this.model));
      });

      Query.prototype.remove = Model.defer(function(opts) {
        var _this = this;
        if (opts == null) {
          opts = {};
        }
        return this.model.__collection__.then(function(c) {
          return q.ninvoke(c, 'remove', _this.query, opts);
        });
      });

      return Query;

    })();
  };

}).call(this);
