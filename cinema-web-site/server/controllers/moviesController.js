const axios = require('axios');

module.exports.displayMovies = async function(req,res,next)
{
    let movies = await axios.get('http://localhost:4000/api/movies');
    let subscriptions = await axios.get('http://localhost:4000/api/subscribers');

    for (let movie of movies.data){
        movie.membersWatchedMovie = [];
        for (let subscription of subscriptions.data){
            for (let watchedMovie of subscription.movies){
                if(watchedMovie.movieId.includes(movie._id)) {
                    let member = await axios.get('http://localhost:4000/api/members/' + subscription.memberId);
                    movie.membersWatchedMovie.push({ memberId : subscription.memberId, memberName: member.data.name, date : convertFormatOfDateTime(watchedMovie.date)});                }
            }
          
        }
    }

    res.render('layout', { page: "movies/allMovies", movies: movies.data });
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


module.exports.displayMovie = async function(req,res,next)
{
    let movie = await axios.get('http://localhost:4000/api/movies/' + req.params.id);
    res.render('layout', { page: "movies/allMovies", movies: [movie.data] });
}


module.exports.displayAddMovie = function(req,res,next)
{
    res.render('layout', { page: "movies/addPage" });
}

module.exports.performAddMovie = function(req,res,next)
{
    axios.post("http://localhost:4000/api/movies",  
    {
        "name": req.body.name,
        "genres": req.body.genres.split(','),
        "image": req.body.imageURL,
        "premiered":  new Date(req.body.premiered)
    })
    .then(() => res.redirect('/movies/allMovies'));
}

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