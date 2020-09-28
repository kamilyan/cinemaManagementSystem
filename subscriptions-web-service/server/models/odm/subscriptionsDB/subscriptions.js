let mongoose = require('mongoose');

// create a model class 
let subscriptionSchema = mongoose.Schema({
    memberId: mongoose.ObjectId,
    movies:  [ new  mongoose.Schema({ movieId : mongoose.ObjectId, date : Date }, {_id: false})]
},
{
    collection: 'subscriptions'
});

module.exports = mongoose.model('subscriptions', subscriptionSchema);