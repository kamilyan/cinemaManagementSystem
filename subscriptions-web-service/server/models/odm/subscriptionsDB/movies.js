let mongoose = require('mongoose');

// create a model class 
let movieSchema = mongoose.Schema({
    name: String,
    genres: [String],
    image: String,
    premiered: Date
},
{
    collection: 'movies'
});

module.exports = mongoose.model('movies', movieSchema);