const seeder = require('mongoose-seed');
const axios = require('axios');
const db = require('./db');
const usersDAL = require('../models/dals/usersDAL');
const permissionsDAL = require('../models/dals/permissionsDAL');
const userModel = require('../models/odm/userDB/users');

// seeds members DB, movies DB (from web service) and user DB (intialize an admin)

seeder.connect(db.URI,{ useNewUrlParser: true, useUnifiedTopology: true},async function(){
    seeder.loadModels([
        __dirname +"/../models/odm/subscriptionsDB/movies",
        __dirname +"/../models/odm/subscriptionsDB/members",
        __dirname +"/../models/odm/userDB/users"
    ]);
    seeder.clearModels(['movies','members', 'User'],async function() {
        let populateMovie = await getMoviesData();
        let populateMembers = await getMembersData();
        let populateAdmin = getAdmin();
        seeder.populateModels([populateMovie, populateMembers, populateAdmin], async function(){
            await intializeAdminFile();
        });
    });
});

async function getMoviesData()
{
    let movies = await axios.get("https://api.tvmaze.com/shows");
    let moviesCollections = movies.data.map(movie  => { return {
        name: movie.name,
        genres: movie.genres,
        image: movie.image.medium,
        premiered: movie.premiered
    }});
    return { 'model': 'movies', 'documents' : moviesCollections }; 
}

async function getMembersData()
{
    let members = await axios.get("https://jsonplaceholder.typicode.com/users");
    let membersCollections = members.data.map(member  => { return {
        name: member.name,
        email: member.email,
        city: member.address.city
    }});
    return { 'model': 'members', 'documents' : membersCollections }; 
}



function getAdmin() {
    return { 'model': 'User', 'documents': [{ username: "admin", password: "admin" }] };
}

async function intializeAdminFile(){
    userModel.find({username : "admin"}, async (err, user)  => {
        //intialize admin.
        let adminDetails = {
            "id": user[0]._id,
            "firstName": "admin",
            "lastName": "admin",
            "createdData": Date.now(),
            "sessionTimeOut": 86400000
        }

        let adminPermissions = {
            "id": user[0]._id,
            "permissions": [
                "View subscriptions",
                "Create subscriptions",
                "Delete subscriptions",
                "View movies",
                "Create movies",
                "Delete movies"
            ]
        }
        
        //intialize json files with admin info, everytime the system starts.
        await usersDAL.saveUsers({"users": [adminDetails]});
        await permissionsDAL.saveUsers({"users": [adminPermissions]});
    });
}