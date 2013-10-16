{Model} = require 'moddl'
require '../lib/moddl-mongo'

Model.Mongo.connect('mongodb://localhost/awesomebox-api-new')

class User extends Model.Mongo('users')

$_ = (o) -> console.log if o.stack? then o.stack else o

User.where(email: 'matt.insler@gmail.com').array()
.then($_).catch($_)
