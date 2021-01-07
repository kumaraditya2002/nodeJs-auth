const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'mysecret123456',(err,decodedToken)=>{
            if(err) res.redirect('/login');
            else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}

//check current logged in user
const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'mysecret123456',async (err,decodedToken)=>{
            if(err){
                res.locals.user=null;
                console.log(err);
                next();
            } 
            else{
                // console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else{
        res.locals.user=null;
        next();
    }
}
module.exports = {requireAuth,checkUser};