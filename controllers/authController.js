const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleErrors = (err)=>{
    // console.log(err.message,err.code);
    let errors = {email:"",password:""};
    if(err.message === 'incorrect email')
        errors.email = 'That email is not registered';
    if(err.message === 'incorrect password')
        errors.password = 'Wrong password';
    //duplicate error code
    if(err.code===11000)
    {
        errors.email = "Email Already registered";
        return errors;
    }
    //validating user
    if(err.message.includes('user validation failed'))
    {
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const maxAge = 3*24*60*60;
const createToken = (id) =>{
    return jwt.sign({id},'mysecret123456',{
        expiresIn:maxAge
    });
}

module.exports.signup_get = (req,res)=>{
    res.render('signup');
}
module.exports.login_get = (req,res)=>{
    res.render('login');
}
module.exports.signup_post = async (req,res)=>{
    const {email,password}=req.body;
    try {
       const user =  await User.create({email,password});
       const token = createToken(user._id);
       res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
       res.status(201).json({user:user._id});
    } catch (error) {
        const errors=handleErrors(error);
        res.status(400).json({errors});
    }
}
module.exports.login_post = async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            const auth = await bcrypt.compare(password,user.password);
            if(auth){
                const token = createToken(user._id);
                res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                return res.status(201).json({user:user._id});
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect email');
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
    
}

module.exports.logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}
