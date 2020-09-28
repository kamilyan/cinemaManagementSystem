const axios = require('axios');

module.exports.displayMembers = async function(req,res,next)
{
    let subscriber_moviesWatched = await axios.get('http://localhost:4000/api/subscribers');

    let subscriber_personalInfo = await axios.get('http://localhost:4000/api/members/' + "5f721ee6fb128118501cfe43");
    res.render('layout', { page: "subscriptions/allMembers", subscribers: subscriber_personalInfo.data });
}
/*
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

*/