const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter an valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minlength:[6,'Minimum password length is 6 characters']
    },
});
                     //mongoose hooks
//fire a function after a doc has been saved to db
// userSchema.post('save',(doc,next)=>{
//     console.log('new user was created and saved',doc)
//     next();
// });
//fire a function before a doc has been saved to db
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

const User = mongoose.model('user',userSchema);
module.exports = User;