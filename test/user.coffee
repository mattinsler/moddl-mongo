moddl = require 'moddl'
require('../lib/moddl-mongodb')(moddl)

{Model} = moddl

Model.connect(mongodb: 'mongodb://localhost/awesomebox-api-new')

class User extends Model.Mongodb('users')

# $_ = (o) -> console.log if o.stack? then o.stack else o
$_ = -> console.log arguments

# User.where(email: 'matt.insler@gmail.com').count()
# .then($_).catch($_)


# User.where(email: 'test@test.com').remove().then($_, $_)

User.where(_id: 'test').update({$set: {email: 'matt.insler@foo.com'}}, {w: 1})
.then($_).catch($_)

# User.array().then($_)

# User.where(_id: 'mattinsler').count($_)
