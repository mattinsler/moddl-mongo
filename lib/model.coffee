q = require 'q'
{Model} = require 'moddl'

class Model.Mongo extends Model
  constructor: ->
    return super(Model.Mongo, arguments...)
  
  @initialize: (opts) ->
    @options = {}
    if typeof opts is 'string'
      @options.collection = opts
      @options.db = 'DEFAULT'
    else
      @options[k] = v for k, v of opts
    
    # throw new Error('Model.Mongo must either have a `db` option or you must call Model.Mongo.connect(db_url) first') unless @options.db?
    # throw new Error('Model.Mongo requires a collection name') unless @options.collection?
    # 
    Object.defineProperty @, '__collection__',
      enumerable: true
      get: ->
        Model.Mongo.provider.get_collection(@options.db, @options.collection)
  
  @load: (instance, data) ->
    instance[k] = v for k, v of data
  
  @connect: (url) ->
    Model.Mongo.provider.connect(name: 'DEFAULT', url: url)
  
  @where: -> new @Query(@).where(arguments...)

  @sort: -> @where().sort(arguments...)
  @skip: -> @where().skip(arguments...)
  @limit: -> @where().limit(arguments...)
  @fields: -> @where().fields(arguments...)

  @first: -> @where().first(arguments...)
  @array: -> @where().array(arguments...)
  @count: -> @where().count(arguments...)

  @save: (obj, opts, callback) -> @where().save(obj, opts, callback)
  @update: (query, update, opts, callback) -> @where(query).update(update, opts, callback)
  @remove: (query, opts, callback) -> @where(query).remove(opts, callback)

  @find_and_modify: Model.defer (query, sort, update, opts) ->
    if typeof opts is 'function'
      # callback = opts
      opts = {}
    
    @__collection__.then (c) =>
      q.ninvoke(c, 'findAndModify', query, sort, update, opts)
    .then(Model.wrapper(@))
