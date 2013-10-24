module.exports = (moddl) ->
	require('./model')(moddl)
	require('./query')(moddl)
	moddl.Model.Mongodb.provider = require('./provider')(moddl)
