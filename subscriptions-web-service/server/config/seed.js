const seeder = require('mongoose-seed');
const axios = require('axios');
const db = require('./db');

// seeds members DB, movies DB (from web service)

seeder.connect(db.URI, { useNewUrlParser: true, useUnifiedTopology: true }, async function () {
    seeder.loadModels([
        __dirname + "/../models/odm/subscriptionsDB/movies",
        __dirname + "/../models/odm/subscriptionsDB/members",
    ]);
    seeder.clearModels(['movies', 'members'], async function () {
        let populateMovie = await getMoviesData();
        let populateMembers = await getMembersData();
        seeder.populateModels([populateMovie, populateMembers], async function () {
        });
    });
});

async function getMoviesData() {
    let movies;
    try {
        movies = await axios.get("https://api.tvmaze.com/shows");
    } catch (error) {
        console.log(error);
    }
    let moviesCollections = movies.data.map(movie => {
        return {
            name: movie.name,
            genres: movie.genres,
            image: movie.image.medium,
            premiered: movie.premiered
        }
    });
    return { 'model': 'movies', 'documents': moviesCollections };
}

async function getMembersData() {
    let members;
    try {
        members = await axios.get("https://jsonplaceholder.typicode.com/users");

    } catch (error) {
        console.log(error);
    }
    let membersCollections = members.data.map(member => {
        return {
            name: member.name,
            email: member.email,
            city: member.address.city
        }
    });
    return { 'model': 'members', 'documents': membersCollections };
}