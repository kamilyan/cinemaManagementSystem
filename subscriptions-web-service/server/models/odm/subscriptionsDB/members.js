let mongoose = require('mongoose');

// create a model class 
let memberSchema = mongoose.Schema({
    name: String,
    email: String,
    city: String

},
    {
        collection: 'members'
    });

module.exports = mongoose.model('members', memberSchema);