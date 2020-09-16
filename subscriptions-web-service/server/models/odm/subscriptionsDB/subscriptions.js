let mongoose = require('mongoose');

// create a model class 
let subscriptionSchema = mongoose.Schema({
    memberId: Schema.Types.ObjectId,
    movies: [{movieId: Schema.Types.ObjectId, date: Date}]
},
{
    collection: 'subscriptions'
});

module.exports = mongoose.model('subscriptions', subscriptionSchema);