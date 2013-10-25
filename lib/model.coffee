mongodb = require 'mongodb'

module.exports = (moddl) ->
	{q, Model} = moddl
  
	class Model.Mongodb extends Model
	  constructor: ->
	    return super(Model.Mongodb, arguments...)
  
	  @initialize: (opts) ->
	    @options = {}
	    if typeof opts is 'string'
	      @options.collection = opts
	      @options.db = 'DEFAULT'
	    else
	      @options[k] = v for k, v of opts
    
	    # throw new Error('Model.Mongodb must either have a `db` option or you must call Model.Mongodb.connect(db_url) first') unless @options.db?
	    # throw new Error('Model.Mongodb requires a collection name') unless @options.collection?
	    # 
	    Object.defineProperty @, '__collection__',
	      enumerable: true
	      get: ->
	        Model.Mongodb.provider.get_collection(@options.db, @options.collection)
  
	  @load: (instance, data) ->
	    instance[k] = v for k, v of data
  
	  @connect: (url) ->
      Model.Mongodb.provider.connect(name: 'DEFAULT', url: moddl.betturl.format(url))
  
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
	    opts ?= {}
    
	    @__collection__.then (c) =>
	      q.ninvoke(c, 'findAndModify', query, sort, update, opts)
	    .then(Model.wrapper(@))
  
  Model.Mongodb[t] = mongodb[t] for t in ['Long', 'ObjectID', 'Timestamp', 'DBRef', 'Binary', 'Code', 'Symbol', 'MinKey', 'MaxKey', 'Double']
