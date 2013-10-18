q = require 'q'
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
  
  first: Model.defer ->
    @model.__collection__.then (c) =>
      q.ninvoke(c.find(@query, @opts), 'nextObject')
    .then(Model.wrapper(@model))

  array: Model.defer ->
    @model.__collection__.then (c) =>
      q.ninvoke(c.find(@query, @opts), 'toArray')
    .then(Model.wrapper(@model))

  count: Model.defer ->
    @model.__collection__.then (c) =>
      q.ninvoke(c, 'count')

  save: Model.defer (obj, opts) ->
    if typeof obj is 'function'
      # callback = obj
      opts = {}
      obj = {}
    if typeof opts is 'function'
      # callback = opts
      opts = {}

    save_obj = {}
    save_obj[k] = v for k, v of obj when not Object.getOwnPropertyDescriptor(obj, k).get?
    save_obj[k] = v for k, v of @query when not Object.getOwnPropertyDescriptor(@query, k).get?
    
    @model.__collection__.then (c) =>
      q.ninvoke(c, 'save', save_obj, opts)
    .then =>
      Model.wrapper(@model)(save_obj)
  
  update: Model.defer (update, opts) ->
    if typeof opts is 'function'
      # callback = opts
      opts = {}

    @model.__collection__.then (c) =>
      q.ninvoke(c, 'update', @query, update, opts)
    .then(Model.wrapper(@model))

  remove: Model.defer (opts) ->
    if typeof opts is 'function'
      callback = opts
      opts = {}

    @model.__collection__.then (c) =>
      q.ninvoke(c, 'remove', @query, opts)
