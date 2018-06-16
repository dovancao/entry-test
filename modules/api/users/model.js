const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserModel = new Schema ({
    username: {type:'String', required: true, unique: true},
    password: {type:'String', required: true},
    fullname: {type:'String', default:''},
    email: {type:'String', unique: true},
    active: { type: Boolean, default: true}
}, {
    timestamps: { createdAt: "createdAt"}
});

UserModel.pre("save", function(next){
    console.log(this);
    if(this.passwordChange || !this._id){
    const saltRounds = 10;
    const plainPassword = this.passwordChange || this.password;
    bcrypt.genSalt(saltRounds)
            .then(salt => bcrypt.hash(plainPassword, salt))
            .then(hashPassword => {
                this.password = hashPassword;
                next();
            })
            .catch(err => next(err))
        }else next();
});

module.exports = mongoose.model("User", UserModel);