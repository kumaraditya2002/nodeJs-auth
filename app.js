const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middlewares/authMiddleware');

const app = express();
const port = 3000;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://aditya:aditya9006@cluster0.2mwbf.mongodb.net/nodeauth?retryWrites=true&w=majority';
mongoose.connect(dbURI,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true,
}, err => {
  if(err) throw err;
  console.log("Connected to db");
});

// routes
app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

//server 
app.listen(port,()=>{
  console.log(`server started at ${port}`);
});