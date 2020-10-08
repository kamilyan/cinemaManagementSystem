const axios = require('axios');
const permissions = require("../models/dals/permissionsDAL");

async function getMoviePermissions(userId){
    let userPermissions = await permissions.getUserById(userId);
    let moviePermissions = userPermissions.permissions.filter(permission =>
            ["viewMovies","createMovies","deleteMovies","updateMovies"].indexOf(permission) > -1);

    return moviePermissions;
}

module.exports.displayMovies = async function(req,res,next)
{   
    let validPermission = await getMoviePermissions(req.user._id)
    if(validPermission.indexOf("viewMovies") > -1) {
        let movies = await axios.get('http://localhost:4000/api/movies');
        let subscriptions = await axios.get('http://localhost:4000/api/subscribers');

        for (let movie of movies.data){
            movie.membersWatchedMovie = [];
            for (let subscription of subscriptions.data){
                for (let watchedMovie of subscription.movies){
                    if(watchedMovie.movieId.includes(movie._id)) {
                        let member = await axios.get('http://localhost:4000/api/members/' + subscription.memberId);
                        movie.membersWatchedMovie.push({ memberId : subscription.memberId, memberName: member.data.name, date : watchedMovie.date});                }
                }
            
            }
        }
        res.render('layout', { page: "movies/allMovies", movies: movies.data , permissions: validPermission});
    }
}

module.exports.displayMovie = async function(req,res,next)
{
    let validPermission = await getMoviePermissions(req.user._id)
    if(validPermission.indexOf("viewMovies") > -1) {
        let movie = await axios.get('http://localhost:4000/api/movies/' + req.params.id);
        let subscriptions = await axios.get('http://localhost:4000/api/subscribers');
        movie = movie.data;
        movie.membersWatchedMovie = [];
            for (let subscription of subscriptions.data){
                for (let watchedMovie of subscription.movies){
                    if(watchedMovie.movieId.includes(movie._id)) {
                        let member = await axios.get('http://localhost:4000/api/members/' + subscription.memberId);
                        movie.membersWatchedMovie.push({ memberId : subscription.memberId, memberName: member.data.name, date : watchedMovie.date});                }
                }
            
            }
    
        res.render('layout', { page: "movies/allMovies", movies: [movie], permissions: validPermission });
    }
}


module.exports.displayAddMovie = async function(req,res,next)
{
    let validPermission = await getMoviePermissions(req.user._id)
    if(validPermission.indexOf("createMovies") > -1) {
        res.render('layout', { page: "movies/addPage" });
    }
}

module.exports.performAddMovie = function(req,res,next)
{
    axios.post("http://localhost:4000/api/movies",  
    {
        "name": req.body.name,
        "genres": req.body.genres.split(','),
        "image": req.body.imageURL,
        "premiered": req.body.premiered
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