const axios = require('axios');

module.exports.displayMovies = async function(req,res,next)
{
    let movies = await axios.get('http://localhost:4000/api/movies');
    res.render('layout', { page: "movies/allMovies", movies: movies.data });
}