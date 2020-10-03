const Subscriber = require('../models/odm/subscriptionsDB/subscriptions');

module.exports.displaySubscribers = async (req,res,next) =>
{
    try
    {
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch(err)
    {
        res.status(500).json({ message: err.message});
    }
}

module.exports.displaySubscriber = async (req,res,next) =>
{
    try
    {
        subscriber = await Subscriber.findById(req.params.id);
        if(subscriber == null)
        {
            return res.status(404).json({message: 'Cannot find this subscriber'});
        }
        res.json(subscriber);
    } catch(err)
    {
        return res.status(500).json({message: err.message});
    }
}

module.exports.addSubscriber = async (req,res,next) =>
{
    let subscriber;
    if(req.body.movies != undefined) {
            subscriber = new Subscriber({
            memberId : req.body.memberId,
            movies : [ { movieId: req.body.movies[0].movieId, date: new Date(req.body.movies[0].date) } ]
        });
    } 
    else {
        subscriber = new Subscriber({
            memberId : req.body.memberId,
        });
    }
    try
    {
        const newSubscriber = await subscriber.save();
        res.status(201).json(newSubscriber);
    } catch(err)
    {
        res.status(400).json({message: err.message })
    }
}

module.exports.editSubscriber = async (req,res,next) =>
{
    try
    {  
        const subscriber = await Subscriber.findById(req.params.id);
        if(subscriber == null)
        {
            return res.status(404).json({message: 'Cannot find this subscriber'});
        }
        subscriber.movies = req.body.movies;
        const updatedSubscriber = await subscriber.save();
        res.status(200).json(updatedSubscriber);
    } catch(err)
    {
        return res.status(500).json({message: err.message});
    }
}

module.exports.deleteSubscriber = async (req,res,next) =>
{
    try
    {
        const subscriber = await Subscriber.findById(req.params.id);
        await subscriber.remove();
        res.json({message: 'Deleted subscriber'});
    } catch(err)
    {
        res.status(500).json({message :err.message});
    }
}