const axios = require('axios');
const { send } = require('process');

module.exports.displayMembers = async function(req,res,next)
{
    let subscriptions = await axios.get('http://localhost:4000/api/subscribers');
    let subscribers = []

    for (subscription of subscriptions.data){
        let subscriber = await axios.get('http://localhost:4000/api/members/' + subscription.memberId);

        subscriber.data.watchedMovies = [];
        subscriber.data.unwatchedMovies = [];

        let movies = await axios.get('http://localhost:4000/api/movies');
        for(movieWatched of subscription.movies) {
            let movieIndex = movies.data.findIndex(movie => movieWatched.movieId == movie._id);
            subscriber.data.watchedMovies.push({ movieId: movieWatched.movieId, movieName : movies.data[movieIndex].name, date : convertFormatOfDateTime(movieWatched.date)});
            movies.data.splice(movieIndex, 1);
        }
        let unwatchedMovies = movies.data.map(movie => { return { movieName : movie.name , movieId : movie._id }});
        subscriber.data.unwatchedMovies = unwatchedMovies;
        subscriber.data.subscriptionId = subscription._id;
        subscribers.push(subscriber.data);
     }
    res.render('layout', { page: "subscriptions/allMembers", members: subscribers });
}

function convertFormatOfDateTime(dateTime){
    date = new Date(dateTime);
    year = date.getFullYear();
    month = date.getMonth()+1;
    dt = date.getDate();

    if (dt < 10) {
    dt = '0' + dt;
    }
    if (month < 10) {
    month = '0' + month;
    }

    return year+'/' + month + '/'+dt;
}


module.exports.displayAddMember = function(req,res,next)
{
    res.render('layout', { page: "subscriptions/addMember" });
}

module.exports.performAddMember = async function(req,res,next)
{
    let newMember = await axios.post("http://localhost:4000/api/members",  
    {
        "name": req.body.name,
        "email": req.body.email,
        "city": req.body.city,
    });
    await axios.post("http://localhost:4000/api/subscribers",
    {
        "memberId": newMember.data._id
    });
    
    res.redirect('/subscriptions');
}

module.exports.performAddMovieToMember = async function(req,res,next)
{
    let subscription = await axios.get('http://localhost:4000/api/subscribers/' + req.params.id);
    subscription.data.movies.push({ movieId: req.body.movieId, date: req.body.watchMovieDate });
    let movie = await axios.get('http://localhost:4000/api/movies/' + req.body.movieId);
    await axios.put('http://localhost:4000/api/subscribers/' + req.params.id, subscription.data);
    res.status(200).json({movie: {movieName: movie.data.name, movieId: req.body.movieId, date: req.body.watchMovieDate }}
    );
}


module.exports.displayEditMember = async function(req,res,next)
{
    let editedMember = await axios.get("http://localhost:4000/api/members/" + req.params.id);
    console.log(editedMember)
    res.render( 'layout', { page: 'subscriptions/editMember', member : editedMember.data } );
}

module.exports.performEditMember = async function(req,res,next)
{
    await axios.put("http://localhost:4000/api/members/" + req.params.id,  
    {
        "name": req.body.name,
        "email": req.body.email,
        "city": req.body.city,
    });
    
    res.redirect('/subscriptions');
}

module.exports.performDeleteMember = async function(req,res,next) 
{
    await axios.delete("http://localhost:4000/api/members/" + req.params.id);
    let subscribers = await axios.get("http://localhost:4000/api/subscribers");
    let deleteSubscriber = subscribers.data.find(subscriber => subscriber.memberId === req.params.id);
    console.log(deleteSubscriber)
    await axios.delete("http://localhost:4000/api/subscribers/" + deleteSubscriber._id);

    res.redirect('/subscriptions');
}