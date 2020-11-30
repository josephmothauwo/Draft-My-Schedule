if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }  


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
const PORT = 3000
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

router.post('/register', async (req,res)=>{
    try{
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        
        users.push({
            id: Date.now().toString(),
            email: req.body.email, 
            username: req.body.username,
            password: hashedPassword,
            isVerified: false,
            isAdmin: false
        })
        var stringifiedUsers = JSON.stringify(users, null, 2)
        fs.writeFile('users.json', stringifiedUsers, (err) => {
            if (err) throw err;
        });
        res.send(users[users.length -1])
    } catch {

    }
})

router.post('/login', function (req, res, next) {
    // call passport authentication passing the "local" strategy name and a callback function
    passport.authenticate('local', function (error, user, info) {
      // this will execute in any case, even if a passport strategy will find an error
      // log everything to console
    //   console.log(error);
    //   console.log(user);
    //   console.log(info);

      if (error) {
        res.status(401).send(error);
      } else if (!user) {
        res.status(401).send(info);
      } else {
        next();
      }

      res.status(401).send(info);
    })(req, res);
  },

  // function to call once successfully authenticated
  function (req, res) {
    res.status(200).send('logged in!');
  });

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect('/')
// }
//     next()
// }