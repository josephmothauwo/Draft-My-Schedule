if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }  
const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require("bcrypt")
const stringSimilarity = require('string-similarity');
var fs = require('fs')
var usersData = fs.readFileSync("users.json")
var users = JSON.parse(usersData)
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config')
const authenticate = require('passport')
var data = fs.readFileSync("Lab3-timetable-data.json")
var courses = JSON.parse(data)
var schdeulesData = fs.readFileSync("schedules.json")
var schedules = JSON.parse(schdeulesData)
const PORT = 3000
const cors = require('cors');
const { verify } = require('crypto');

const router = express.Router();

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

app.use(cors());

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

// router.post('/login', (req, res)=>{
//     // console.log(req.user)
//     // res.send(req.headers['authorization'])
//     const user = {
//       id: 1,
//       username: "joey",
//       email: "hello@gmail.com"
//     }
//     jwt.sign({user: user}, "secretkey", (err, token) => {
//       res.json({
//         tokem: token
//       })
//     })

// })

router.get("/confirmation/:token", (req,res)=>{
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
    res.send(users)
  })

})

router.post('/register', async (req,res)=>{
    try{
      if (req.body.email.length == 0 && req.body.password.length == 0){
        res.status(404).send("no email and password given")
        return
      }
      if (req.body.password.length == 0){
        res.status(404).send("no password")
        return
      }
        if (req.body.email.length == 0){
          res.status(404).send("no email")
          return
        }
        if (req.body.password.length == 0){
          res.status(404).send("no password")
          return
        }
        flag = 0
        for (var i = 0; i < req.body.email.length; i++) {
          if(req.body.email[i]=="@"){
            flag = i
          }
        }

        if(req.body.email.length - 1 == flag || flag == 0){
          res.status(404).send("not a valid email")
          return
        }
        const foundUser = users.find(user => user.email.toUpperCase() === req.body.email.toUpperCase());
        if(foundUser){
          res.status(404).send("this email already exisits")
          return
        }
        
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        let tempUser = {
          id: Date.now().toString(),
          email: req.body.email, 
          username: req.body.username,
          password: hashedPassword,
          isVerified: false,
          isAdmin: false,
          isDeactivated: false,
          accessToken: null, 
          loginToken: null
        }
        console.log(tempUser)
        const accessToken = jwt.sign(tempUser, process.env.ACCESS_TOKEN_SECRET)
        const url = `http://localhost:3000/UA/confirmation/${accessToken}`
        tempUser.accessToken = url
        tempUser.loginToken = accessToken
        users.push(tempUser)
        var stringifiedUsers = JSON.stringify(users, null, 2)
        fs.writeFile('users.json', stringifiedUsers, (err) => {
            if (err) throw err;
        });
        
        var sendBack = {
          "url": url
        }
        console.log(sendBack)
        res.send(sendBack)
    } catch {
      
    }
})

router.get('/courses/:subject?/:course_code?', (req, res) => {
  console.log(req.params.subject, req.params.course_code)
  
  // filter course codes
  
 
  // 2 different cases if the coursecomponent is given 
  tableEntry = []
  if(!req.params.course_code){
    // console.log("hello")
    if(validate(req.params.subject) || sanitization(req.params.subject)){
      res.status(404).send('invalid input')
    }
    const subject = strip(req.params.subject)
      for(course of courses){
          if(subject === course["subject"]){
              tableEntry.push({
                "catalog_nbr" : course["catalog_nbr"].toString(),
                "subject" : course["subject"], 
                "className" : course["className"], 
                "class_section" : course["course_info"][0]["class_section"],  
                "ssr_component" : course["course_info"][0]["ssr_component"],
                "start_time" : course["course_info"][0]["start_time"],
                "end_time" : course["course_info"][0]["end_time"],
                "days" : course["course_info"][0]["days"],
              })
          }
      }
  }
  else if(req.params.subject == "NONE"){
    
    if(validate(req.params.course_code) || sanitization(req.params.course_code)){
      res.status(404).send('invalid input')
    }
    const course_code = strip(req.params.course_code)
    for(course of courses){
     
      let flag = true
      for(let i = 0; i < course_code.length; i++){
        if (course_code[i] != course["catalog_nbr"].toString()[i]){
          flag = false
        }
      }
      if(flag){
          tableEntry.push({
            "catalog_nbr" : course["catalog_nbr"].toString(),
            "subject" : course["subject"], 
            "className" : course["className"], 
            "class_section" : course["course_info"][0]["class_section"],  
            "ssr_component" : course["course_info"][0]["ssr_component"],
            "start_time" : course["course_info"][0]["start_time"],
            "end_time" : course["course_info"][0]["end_time"],
            "days" : course["course_info"][0]["days"],
          })
      }
    }
  }
  
  else{
      if(validate(req.params.course_code) || sanitization(req.params.course_code) || validate(req.params.subject) || sanitization(req.params.subject)){
          res.status(404).send('invalid input')
      }
      const course_code = strip(req.params.course_code)
      const subject = strip(req.params.subject)
      for(course of courses){
          if(subject === course["subject"]){
              let flag = true
              for(let i = 0; i < course_code.length; i++){
                if (course_code[i] != course["catalog_nbr"].toString()[i]){
                  flag = false
                }
              }
              if (flag){
                tableEntry.push({
                  "catalog_nbr" : course["catalog_nbr"].toString(),
                  "subject" : course["subject"], 
                  "className" : course["className"], 
                  "class_section" : course["course_info"][0]["class_section"],  
                  "ssr_component" : course["course_info"][0]["ssr_component"],
                  "start_time" : course["course_info"][0]["start_time"],
                  "end_time" : course["course_info"][0]["end_time"],
                  "days" : course["course_info"][0]["days"],
                })
              }
          }
      }
  }
  if (tableEntry.length === 0 ){
      return res.status(404).send('the course code or subject does not exist')
  }
  res.send(tableEntry)
});

router.get('/keyword/:keyword', (req, res) => {
  keyword = req.params.keyword
  tableEntry = []
  
  if(keyword.length < 4){
    console.log(keyword.length)
    return res.status(404).send("word must be longer than 4 characters")
  }
  
  for(course of courses){
    if(stringSimilarity.compareTwoStrings(course['catalog_nbr'].toString(), keyword) > 0.6 || stringSimilarity.compareTwoStrings(course['className'], keyword) > 0.6){
      tableEntry.push({
        "catalog_nbr" : course["catalog_nbr"].toString(),
        "subject" : course["subject"], 
        "className" : course["className"], 
        "class_section" : course["course_info"][0]["class_section"],  
        "ssr_component" : course["course_info"][0]["ssr_component"],
        "start_time" : course["course_info"][0]["start_time"],
        "end_time" : course["course_info"][0]["end_time"],
        "days" : course["course_info"][0]["days"],
      })
    }
  }
  console.log(tableEntry)
  return res.send(tableEntry)
});


router.post('/login', function (req, res, next){
    // call passport authentication passing the "local" strategy name and a callback function
    console.log(req.body.password)
    console.log(req.body.username)
    authenticatedUser = null

    passport.authenticate('local', function (error, user, info) {
      
      // this will execute in any case, even if a passport strategy will find an error
      // log everything to console
      //   console.log(error);
        console.log(user);
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
        console.log("not verified");
        var sendback = {
          message:"not verified",
          user: user
        }
        res.send(sendback).status(401)

        return
      } 
      else if(user.isDeactivated){

        res.status(401).send("not active");
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
    const access = {
      message:"logged in!",
      user: authenticatedUser,
      accesstoken: accessToken
    }
    res.status(200).send(access);
  });

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
  
  // function checkNotAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return res.redirect('/')
  //   }
  //   next()
  // }

// add a new schdeule to the schdeules json file
router.put('/schedules/:schedule_name/:isPublic/:description?', verifyToken, (req, res) => {
  console.log(req.description, "hello")
  console.log(req.params.schedule_name, req.params.description, req.params.isPublic)
  if(validate(req.params.schedule_name) || sanitization(req.params.schedule_name)){
      res.status(404).send('invalid Input')
      return
  }
  let description = null
  let isPublic = null
  if(req.params.description!=null){
    if((validate(req.params.description) || sanitization(req.params.description))){
      console.log(req.params.description)
      res.status(404).send('invalid Input')
      return
    }
    else{
      description = strip(req.params.description)
    }
}

  if(req.params.isPublic!="False"){
    console.log(req.params.isPublic)
    if((validate(req.params.isPublic) || sanitization(req.params.isPublic))){
      console.log(req.params.isPublic)
      res.status(404).send('invalid Input')
      return
    }
    else{
      isPublic = strip(req.params.isPublic)
    }
  }
  const schedule_name = strip(req.params.schedule_name)
  console.log("hello")
  if(schedules.find(s => s.name.toUpperCase() === schedule_name.toUpperCase())){
      res.status(404).send('Name is already present or invalid name')
      return
  }
  const publicSched = false
  if(isPublic == "YES"){
    publicSched = true
  }
  const newSchedule = {
      name: schedule_name,
      description: description,
      isPublic: publicSched,
      email: req.user["email"], 
      courses: [] 
  }
  schedules.push(newSchedule)
  console.log(schedules)
  var data = JSON.stringify(schedules, null, 2)
  fs.writeFile('schedules.json', data, (err) => {
      if (err) throw err;
    });
  res.send(newSchedule) 
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const tokenHeader = authHeader.split(' ')
  const token = tokenHeader[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// get all the schedules
router.get('/all_schedules',verifyToken, (req, res) => {
  console.log(`GET request from ${req.url}`);
  userEmail = req.user["email"]
  let scheduleSummary = []
  for(schedule of schedules){
      if (userEmail.toUpperCase() == schedule["email"].toUpperCase()){
        scheduleSummary.push([schedule["name"],schedule["description"],schedule["courses"].length])
      }
    }
  res.send(scheduleSummary)
});


  function validate(inputString){
    return ((inputString.length<2) || (inputString.length>20))
}


function sanitization(inputString){
  const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
  const output = inputString.replace(format, "");

  if (inputString  === output){
      return false
  }
  else{
      return true;
  }
}

function strip(inputString){
  const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
  return inputString.replace(format, "")
}