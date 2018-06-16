const express = require("express");
const Router = express.Router();
const AuthController = require ("./controller");

Router.post('/', (req, res) => {
    console.log(req.body);
    AuthController.login(req.body)
        .then(userInfo => {
            req.session.user = userInfo;
            res.send({ success: 1, user: userInfo}); 
        })
        .catch(err => res.status(err.statusCode).send({success: 0, err: err.err}));
})

module.exports = Router;