let mongoose = require('mongoose');

// create a model class 
let userSchema = mongoose.Schema({
    username : String,
    password : String
},
{
    collection: 'users'
});

module.exports = mongoose.model('users', userSchema);