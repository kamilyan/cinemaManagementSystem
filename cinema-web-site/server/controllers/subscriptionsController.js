const axios = require('axios');

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

/*

module.exports.displayEditMovie = function(req,res,next)
{
    axios.get("http://localhost:4000/api/movies/" + req.params.id)
    .then((movie) => {
        res.render('layout', { page: "movies/editPage", movie : movie.data });
    })
}

module.exports.performEditMovie = function(req,res,next)
{
    axios.put("http://localhost:4000/api/movies",  
    {
        "_id": req.params.id,
        "name": req.body.name,
        "genres": req.body.genres.split(','),
        "image": req.body.imageURL,
        "premiered":  new Date(req.body.premiered)
    })
    .then(() => res.redirect('/movies/allMovies'));
}

*/