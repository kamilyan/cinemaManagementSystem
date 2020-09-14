let userModel = require('../models/odm/userDB/users');
let usersDAL= require('../models/dals/usersDAL');
let permissionDAL =require('../models/dals/permissionsDAL'); 

module.exports.displayUsers = function(req, res, next) {
    userModel.find(async (err, usersDB) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            let users = []
            for (user of usersDB) {
                users.push({ "id": user.id, "username": user.username});
            }

            users = await Promise.all(users.map(async(user) => { 
                let userData = await usersDAL.getUserById(user.id);
                let userPermission = await permissionDAL.getUserById(user.id);
             return {
                    "name": userData.firstName + " " + userData.lastName,
                    "username": user.username,
                    "sessionTimeOut": userData.sessionTimeOut,
                    "createdData": userData.createdData,
                    "permissions": userPermission.permissions
                }
            }));
            
            res.render('layout', { page: "users/allUsers", usersDetails : users});    
        }
    })

  };
    
module.exports.displayEditUser = function(req, res, next) {
    res.render('layout', { page: "users/editUser"});
  };
  
module.exports.performEditUser = function(req, res, next) {
      res.render('layout', { page: "users/editUser"});
  };

module.exports.performDeleteUser = function(req, res, next) {
      res.render('layout', { page: "users/editUser"});
  };

module.exports.displayAddUser = function(req, res, next) {
    res.render('layout', { page: "users/addUser"});
  };

module.exports.performAddUser = async function(req, res, next) {
    let newUserDB = userModel({"username": req.body.username });

    let newUserData = {
        "id": newUserDB._id,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "createdData": Date.now(),
        "sessionTimeOut": req.body.sessionTimeOut
    }

    let userPermission = [
        req.body.viewSubscriptions,
        req.body.createSubscriptions,
        req.body.deleteSubscriptions,
        req.body.updateSubscriptions,
        req.body.viewMovies,
        req.body.createMovies,
        req.body.deleteMovies,
        req.body.updateMovies
    ].filter(item => item); // remove empty strings

    let newUserPermission = {
        "id": newUserDB._id,
        "permissions": userPermission
    }

    userModel.create(newUserDB, async (err, userModel) => 
    {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            let usersObj = await usersDAL.getUsers();
            usersObj.users.push(newUserData);
            await usersDAL.saveUsers(usersObj);
        
            let permissionsObj = await permissionDAL.getUsers();
            permissionsObj.users.push(newUserPermission);
            await permissionDAL.saveUsers(permissionsObj);
            
            res.send("OK")
        }
    })
  };