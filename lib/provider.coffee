mongodb = require 'mongodb'

module.exports = (moddl) ->
  {q} = moddl
  {MongoClient} = mongodb
  {EventEmitter} = require 'events'

  Provider = new EventEmitter()

  Provider.cache =
      connected: {}
      connecting: {}

  Provider.get_database = (db_url) ->
    Provider.connect(name: db_url)

  Provider.get_collection = (db_url, collection) ->
    Provider.get_database(db_url).then (db) ->
      db.collection(collection)
  
  Provider.connect = (opts) ->
    opts.name ?= opts.url
  
    return q(Provider.cache.connected[opts.name]) if Provider.cache.connected[opts.name]?
    return Provider.cache.connecting[opts.name] if Provider.cache.connecting[opts.name]?
  
    d = q.defer()
  
    if opts.name? and not opts.url?
      Provider.on 'connect:' + opts.name, ->
        d.resolve(Provider.cache.connected[opts.name])
      return d.promise
  
    Provider.cache.connecting[opts.name] = d.promise
  
    MongoClient.connect opts.url, (err, db) ->
      delete Provider.cache.connecting[opts.name]
      return d.reject(err) if err?
      Provider.cache.connected[opts.name] = db
    
      d.resolve(db)
      Provider.emit('connect:' + opts.name)
  
    d.promise
  
  Provider
