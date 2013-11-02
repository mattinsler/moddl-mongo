module.exports = (moddl) ->
  {q, Model} = moddl

  class Model.Mongodb.Query
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
        q.ninvoke(c.find(@query, @opts), 'count')

    save: Model.defer (obj, opts) ->
      throw new Error('Cannot save null object') unless obj?
      opts ?= {}
    
      save_obj = {}
      save_obj[k] = v for k, v of obj when Object.getOwnPropertyDescriptor(obj, k)?.value?
      save_obj[k] = v for k, v of @query when Object.getOwnPropertyDescriptor(@query, k)?.value?
    
      @model.__collection__.then (c) =>
        q.ninvoke(c, 'save', save_obj, opts)
      .then =>
        Model.wrapper(@model)(save_obj)
  
    update: Model.defer (update, opts) ->
      opts ?= {}

      @model.__collection__.then (c) =>
        q.ninvoke(c, 'update', @query, update, opts)

    remove: Model.defer (opts) ->
      opts ?= {}
    
      @model.__collection__.then (c) =>
        q.ninvoke(c, 'remove', @query, opts)
