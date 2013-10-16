(function() {
  var Model, err;

  try {
    Model = require('moddl').Model;
  } catch (_error) {
    err = _error;
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
    throw new Error('In order to use moddl-mongo you must have moddl installed');
  }

  require('./model');

  require('./query');

  Model.Mongo.provider = require('./provider');

}).call(this);
