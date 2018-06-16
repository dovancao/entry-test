const express = require('express');
const Router = express.Router();
const UserController = require('./controller');


Router.post('/', (req,res) => {
    UserController.create(req.body)
                    .then(userCreated => res.send({ success: 1, user: userCreated}))
                    .catch(err => res.status(500).send({success: 0, err}))
})


Router.get('/:id', (req,res) => {
    // UserController.getUserInfo(req.params.id)
    //                 .then(userFound=> res.send({ success: 1, user: Found}))
    //                 .catch(err => res.status(500).send({success: 0, err}))
        res.render('userList');
})



module.exports = Router;