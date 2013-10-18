{Model} = require 'moddl'
require '../lib/moddl-mongo'

Model.Mongo.connect('mongodb://localhost/awesomebox-api-new')

class User extends Model.Mongo('users')

# $_ = (o) -> console.log if o.stack? then o.stack else o
$_ = -> console.log arguments

# User.where(email: 'matt.insler@gmail.com').count()
# .then($_).catch($_)


User.where(_id: 'test').update($set: {email: 'matt.insler@foo.com'})
.then($_).catch($_)

User.array($_)
