try
  {Model} = require 'moddl'
catch err
  throw err unless err.code is 'MODULE_NOT_FOUND'
  throw new Error('In order to use moddl-mongo you must have moddl installed')

require './model'
require './query'

Model.Mongo.provider = require './provider'
