{Model} = require 'moddl'

class Model.Mongo.Query
  constructor: (@model) ->
    @query = {}
    @opts = {}

  where: (query = {}) ->
    @query[k] = v for k, v of query
    @

  sort: (sort) ->
    @opts.sort = sort
    @

  skip: (skip) ->
    @opts.skip = skip
    @

  limit: (limit) ->
    @opts.limit = limit
    @

  fields: (fields) ->
    @opts.fields = fields
    @
  
  first: Model.defer (callback) ->
    @model.__collection__.then (c) =>
      c.find(@query, @opts).nextObject(Model.wrap_callback(@model, callback))
    .catch(callback)
    null

  array: Model.defer (callback) ->
    @model.__collection__.then (c) =>
      c.find(@query, @opts).toArray(Model.wrap_callback(@model, callback))
    .catch(callback)
    null

  count: Model.defer (callback) ->
    @model.__collection__.then (c) =>
      c.count(@query, callback)
    .catch(callback)
    null

  save: Model.defer (obj, opts, callback) ->
    if typeof obj is 'function'
      callback = obj
      opts = {}
      obj = {}
    if typeof opts is 'function'
      callback = opts
      opts = {}

    save_obj = {}
    save_obj[k] = v for k, v of obj when not Object.getOwnPropertyDescriptor(obj, k).get?
    save_obj[k] = v for k, v of @query when not Object.getOwnPropertyDescriptor(@query, k).get?

    @model.__collection__.then (c) =>
      c.save(save_obj, opts, Model.wrap_callback(@model, callback))
    .catch(callback)
    null

  update: Model.defer (update, opts, callback) ->
    if typeof opts is 'function'
      callback = opts
      opts = {}

    @model.__collection__.then (c) =>
      c.update(@query, update, opts, callback)
    .catch(callback)
    null

  remove: Model.defer (opts, callback) ->
    if typeof opts is 'function'
      callback = opts
      opts = {}

    @model.__collection__.then (c) =>
      c.remove(@query, opts, callback)
    .catch(callback)
    null
