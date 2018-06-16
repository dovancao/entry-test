const  UserModel = require("./model");

const create = ({ username,fullname, password, email}) => new Promise((resolve,reject) => {
    UserModel.create({ username, fullname, password, email})
                .then(userCreated => resolve(userCreated._id))
                .catch(err => reject(err))
})


const getUserInfo = (userId) => new Promise((resolve, reject) => {
    UserModel.findById(userId,"-active -password")
                .then(userFound => resolve(userFound))
                .catch(err => reject(err))
});


//user pageable / 5 records per page
const listUserByPage = (pageNumber) => new Promise((resolve,reject) => {
    UserModel
        .find({active: true}, "username fullname email")
        .sort({createdAt : -1})
        .skip((pageNumber-1)*5)
        .limit(5)
        .exec()
        .then(users => resolve(users))
        .catch(err => reject(err))

})

module.exports = {
    create,
    getUserInfo,
    listUserByPage
}