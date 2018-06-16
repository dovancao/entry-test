const express = require('express');
const Router = express.Router();
const UserController = require('./controller');

Router.get('/:id', (req,res) => {
UserController
        .listUserByPage(req.query.page || 1)
        .then(users =>res.send({success: 1, users:users}))
        .catch(err => {
            console.log(err)
            res.status(500).send({success: 0, errMsg:err });
        })
})

module.exports = Router;