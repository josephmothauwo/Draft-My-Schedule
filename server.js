if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }  
const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require("bcrypt")
var fs = require('fs')
var usersData = fs.readFileSync("users.json")
var users = JSON.parse(usersData)
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config')
const authenticate = require('passport')
const PORT = 3000
const nodemailer = require('nodemailer')
const router = express.Router();

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

router.use(express.json());
app.use('/UA', router);
router.get('/register', async (req,res)=>{
    res.send("hiiii")
})

router.get('/login', authenticateToken, (req, res)=>{
    console.log(req.user)
    res.send(req.headers['authorization'])
})

router.get("/confirmation/:token", (req,res)=>{
  console.log("hello")
  jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    for (let i = 0; i < users.length; i++) {
        if(users[i].email === user.email){
          users[i].isVerified = true;
        }
    }
    var data = JSON.stringify(users, null, 2)
    fs.writeFile('users.json', data, (err) => {
      if (err) throw err;
    });
    res.send("sucess!")
  })

})

router.post('/register', async (req,res)=>{
    try{
        const foundUser = users.find(user => user.email.toUpperCase() === req.body.email.toUpperCase());
        if(foundUser){
          res.status(404).send("nope")
          return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        let tempUser = {
          id: Date.now().toString(),
          email: req.body.email, 
          username: req.body.username,
          password: hashedPassword,
          isVerified: false,
          isAdmin: false
        }
        
        users.push(tempUser)
        var stringifiedUsers = JSON.stringify(users, null, 2)
        fs.writeFile('users.json', stringifiedUsers, (err) => {
            if (err) throw err;
        });
        const accessToken = jwt.sign(tempUser, process.env.ACCESS_TOKEN_SECRET)
        const url = `http://localhost:3000/UA/confirmation/${accessToken}`
        console.log(url)
        res.send(users[users.length -1])
    } catch {
      
    }
})



router.post('/login', function (req, res, next){
    // call passport authentication passing the "local" strategy name and a callback function
    
    authenticatedUser = null
    passport.authenticate('local', function (error, user, info) {
      console.log(user)
      
      // this will execute in any case, even if a passport strategy will find an error
      // log everything to console
      //   console.log(error);
      //   console.log(user);
      //   console.log(info);
      if (error) {
        
        res.status(401).send(error);
        return
      } 
      else if (!user) {
        
        res.status(401).send(info);
        return
      } 
      else if(!user.isVerified){

        res.status(401).send("not verified");
        return
      } 
      else {
        
        authenticatedUser = user
        next();
      }
      res.status(401).send(info);
      
    })(req, res);
  },
  // function to call once successfully authicated
  function (req, res) {
    const username = authenticatedUser.username;
    const accessToken = jwt.sign(authenticatedUser, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).send(accessToken);
  });

//   function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       return next()
//     }
  
//     res.redirect('/login')
//   }
  
//   function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       return res.redirect('/')
//     }
//     next()
//   }

  function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

  // step 1

// async..await is not allowed in global scope, must use a wrapper
