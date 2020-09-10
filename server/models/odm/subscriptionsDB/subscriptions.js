let mongoose = require('mongoose');

// create a model class 
let memberSchema = mongoose.Schema({
    memberId: String,
    movies: [{movieId: ObjectId, date: Date}],
    city: String
},
{
    collection: 'members'
});

module.exports = mongoose.model('members', memberSchema);