const axios = require('axios');
const { move } = require('../config/app');
const permissions = require("../models/dals/permissionsDAL");

async function getMoviePermissions(userId) {
    try {
        let userPermissions = await permissions.getUserById(userId);
        let moviePermissions = userPermissions.permissions.filter(permission =>
            ["viewMovies", "createMovies", "deleteMovies", "updateMovies"].indexOf(permission) > -1);

        return moviePermissions;
    } catch (error) {
        console.log(error);
        res.end();
    }

}

module.exports.displayMovies = async function (req, res, next) {
    try {
        let validPermission = await getMoviePermissions(req.user._id)
        if (validPermission.indexOf("viewMovies") > -1) {
            let movies = await axios.get('http://localhost:4000/api/movies');
            let subscriptions = await axios.get('http://localhost:4000/api/subscribers');

            for (let movie of movies.data) {
                movie.membersWatchedMovie = [];
                for (let subscription of subscriptions.data) {
                    for (let watchedMovie of subscription.movies) {
                        if (watchedMovie.movieId.includes(movie._id)) {
                            let member = await axios.get('http://localhost:4000/api/members/' + subscription.memberId);
                            movie.membersWatchedMovie.push({ memberId: subscription.memberId, subscriptionId: subscription._id, memberName: member.data.name, date: watchedMovie.date });
                        }
                    }

                }
            }
            res.render('layout', { page: "movies/allMovies", movies: movies.data, permissions: validPermission });
        }
        else{
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.end();
    }
}

module.exports.displayMovie = async function (req, res, next) {
    try {
        let validPermission = await getMoviePermissions(req.user._id)
        if (validPermission.indexOf("viewMovies") > -1) {
            let movie = await axios.get('http://localhost:4000/api/movies/' + req.params.id);
            let subscriptions = await axios.get('http://localhost:4000/api/subscribers');
            movie = movie.data;
            movie.membersWatchedMovie = [];
            for (let subscription of subscriptions.data) {
                for (let watchedMovie of subscription.movies) {
                    if (watchedMovie.movieId.includes(movie._id)) {
                        let member = await axios.get('http://localhost:4000/api/members/' + subscription.memberId);
                        movie.membersWatchedMovie.push({ memberId: subscription.memberId, memberName: member.data.name, date: watchedMovie.date });
                    }
                }

            }
            res.render('layout', { page: "movies/allMovies", movies: [movie], permissions: validPermission });
        }
        else{
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.end();
    }

}


module.exports.displayAddMovie = async function (req, res, next) {
    try {
        let validPermission = await getMoviePermissions(req.user._id)
        if (validPermission.indexOf("createMovies") > -1) {
            res.render('layout', { page: "movies/addPage" });
        }
        else{
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.end();
    }

}

module.exports.performAddMovie = function (req, res, next) {
    try {
        axios.post("http://localhost:4000/api/movies",
            {
                "name": req.body.name,
                "genres": req.body.genres.split(','),
                "image": req.body.imageURL,
                "premiered": req.body.premiered
            })
            .then(() => res.redirect('/movies/allMovies'));
    } catch (error) {
        console.log(error);
        res.end();
    }

}

module.exports.displayEditMovie = function (req, res, next) {
    try {
        axios.get("http://localhost:4000/api/movies/" + req.params.id)
            .then((movie) => {
                res.render('layout', { page: "movies/editPage", movie: movie.data });
            });

    } catch (error) {
        console.log(error);
        res.end();
    }
}

module.exports.performEditMovie = function (req, res, next) {
    try {
        axios.put("http://localhost:4000/api/movies",
            {
                "_id": req.params.id,
                "name": req.body.name,
                "genres": req.body.genres.split(','),
                "image": req.body.imageURL,
                "premiered": new Date(req.body.premiered)
            })
            .then(() => res.redirect('/movies/allMovies'));
    } catch (error) {
        console.log(error);
        res.end();
    }

}

module.exports.performDeleteMovie = async function (req, res, next) {
    try {
        await axios.delete("http://localhost:4000/api/movies/" + req.params.id)
        let subscribers = await axios.get("http://localhost:4000/api/subscribers");

        for (let subscriber of subscribers.data) {
            index = subscriber.movies.findIndex(async movie => movieId == req.params.id)
            if (index != -1) {
                subscriber.movies.splice(index, 1);
                await axios.put("http://localhost:4000/api/subscribers/" + subscriber._id,
                    {
                        movies: subscriber.movies
                    })
            }
        };
        res.redirect('/movies/allMovies');
    } catch (error) {
        console.log(error);
        res.end();
    }
}