const axios = require('axios');
const permissions = require("../models/dals/permissionsDAL");

async function getSubscriptionPermissions(userId) {
    try {
        let userPermissions = await permissions.getUserById(userId);
        let subscriptionsPermissions = userPermissions.permissions.filter(permission =>
            ["viewSubscriptions", "createSubscriptions", "deleteSubscriptions", "updateSubscriptions"].indexOf(permission) > -1);

        return subscriptionsPermissions;
    } catch (error) {
        console.log(error);
        res.end();
    }

}

module.exports.displayMembers = async function (req, res, next) {
    try {
        let validPermission = await getSubscriptionPermissions(req.user._id)
        if (validPermission.indexOf("viewSubscriptions") > -1) {
            let subscriptions = await axios.get('http://localhost:4000/api/subscribers');
            let subscribers = []

            for (let subscription of subscriptions.data) {
                let subscriber = await axios.get('http://localhost:4000/api/members/' + subscription.memberId);

                subscriber.data.watchedMovies = [];
                subscriber.data.unwatchedMovies = [];

                let movies = await axios.get('http://localhost:4000/api/movies');
                for (let movieWatched of subscription.movies) {
                    let movieIndex = movies.data.findIndex(movie => movieWatched.movieId == movie._id);
                    subscriber.data.watchedMovies.push({ movieId: movieWatched.movieId, movieName: movies.data[movieIndex].name, date: convertFormatOfDateTime(movieWatched.date) });
                    movies.data.splice(movieIndex, 1);
                }
                let unwatchedMovies = movies.data.map(movie => { return { movieName: movie.name, movieId: movie._id } });
                subscriber.data.unwatchedMovies = unwatchedMovies;
                subscriber.data.subscriptionId = subscription._id;
                subscribers.push(subscriber.data);
            }
            res.render('layout', { page: "subscriptions/allMembers", members: subscribers, permissions: validPermission });
        }
        else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.end();
    }
}


module.exports.displayMember = async function (req, res, next) {
    try {
        let validPermission = await getSubscriptionPermissions(req.user._id)
        if (validPermission.indexOf("viewMovies") > -1) {
            let subscription = await axios.get('http://localhost:4000/api/subscribers/' + req.params.id);

            let subscriber = await axios.get('http://localhost:4000/api/members/' + subscription.data.memberId);

            subscriber.data.watchedMovies = [];
            subscriber.data.unwatchedMovies = [];

            let movies = await axios.get('http://localhost:4000/api/movies');
            for (let movieWatched of subscription.data.movies) {
                let movieIndex = movies.data.findIndex(movie => movieWatched.movieId == movie._id);
                subscriber.data.watchedMovies.push({ movieId: movieWatched.movieId, movieName: movies.data[movieIndex].name, date: convertFormatOfDateTime(movieWatched.date) });
                movies.data.splice(movieIndex, 1);
            }
            let unwatchedMovies = movies.data.map(movie => { return { movieName: movie.name, movieId: movie._id } });
            subscriber.data.unwatchedMovies = unwatchedMovies;
            subscriber.data.subscriptionId = subscription.data._id;
            console.log(subscriber)
            res.render('layout', { page: "subscriptions/allMembers", members: [subscriber.data], permissions: validPermission });
        }
        else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.end();
    }
}

function convertFormatOfDateTime(dateTime) {
    date = new Date(dateTime);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return year + '/' + month + '/' + dt;
}


module.exports.displayAddMember = async function (req, res, next) {
    try {
        let validPermission = await getSubscriptionPermissions(req.user._id)
        if (validPermission.indexOf("createSubscriptions") > -1) {
            res.render('layout', { page: "subscriptions/addMember" });
        }
        else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.end();
    }
}

module.exports.performAddMember = async function (req, res, next) {
    try {
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
    } catch (error) {
        console.log(error);
        res.end();
    }
}

module.exports.performAddMovieToMember = async function (req, res, next) {
    try {
        let subscription = await axios.get('http://localhost:4000/api/subscribers/' + req.params.id);
        subscription.data.movies.push({ movieId: req.body.movieId, date: req.body.watchMovieDate });
        let movie = await axios.get('http://localhost:4000/api/movies/' + req.body.movieId);
        await axios.put('http://localhost:4000/api/subscribers/' + req.params.id, subscription.data);
        res.status(200).json({ movie: { movieName: movie.data.name, movieId: req.body.movieId, date: req.body.watchMovieDate } }
        );
    } catch (error) {
        console.log(error);
        res.end();
    }

}


module.exports.displayEditMember = async function (req, res, next) {
    try {
        let editedMember = await axios.get("http://localhost:4000/api/members/" + req.params.id);
        res.render('layout', { page: 'subscriptions/editMember', member: editedMember.data });
    } catch (error) {
        console.log(error);
        res.end();
    }

}

module.exports.performEditMember = async function (req, res, next) {
    try {
        await axios.put("http://localhost:4000/api/members/" + req.params.id,
            {
                "name": req.body.name,
                "email": req.body.email,
                "city": req.body.city,
            });

        res.redirect('/subscriptions');
    } catch (error) {
        console.log(error);
        res.end();
    }

}

module.exports.performDeleteMember = async function (req, res, next) {
    try {
        await axios.delete("http://localhost:4000/api/members/" + req.params.id);
        let subscribers = await axios.get("http://localhost:4000/api/subscribers");
        let deleteSubscriber = subscribers.data.find(subscriber => subscriber.memberId === req.params.id);
        console.log(deleteSubscriber)
        await axios.delete("http://localhost:4000/api/subscribers/" + deleteSubscriber._id);

        res.redirect('/subscriptions');
    } catch (error) {
        console.log(error);
        res.end();
    }
}