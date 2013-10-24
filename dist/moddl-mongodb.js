(function() {
  module.exports = function(moddl) {
    require('./model')(moddl);
    require('./query')(moddl);
    return moddl.Model.Mongodb.provider = require('./provider')(moddl);
  };

}).call(this);
