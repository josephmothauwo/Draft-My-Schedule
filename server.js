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
var reviewsData = fs.readFileSync("reviews.json")
var reviews = JSON.parse(reviewsData)
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
  
  tableEntry = []
  if(!req.params.course_code){
    if(validate(req.params.subject) || sanitization(req.params.subject)){
      res.status(404).send('invalid input')
    }
    const subject = strip(req.params.subject)
      for(course of courses){
        courseReviews = []
        for(review of reviews){
          if(course['catalog_nbr'].toString().toUpperCase() == review["catalog_nbr"].toUpperCase() && course['subject'].toString().toUpperCase() == review["subject"].toUpperCase() && !review["isHidden"]){
            courseReviews.push(review)
          }
        }
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
              "reviews": courseReviews
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
        courseReviews = []
        for(review of reviews){
          if(course['catalog_nbr'].toString().toUpperCase() == review["catalog_nbr"].toUpperCase() && course['subject'].toString().toUpperCase() == review["subject"].toUpperCase() && !review["isHidden"]){
            courseReviews.push(review)
          }
        }
        tableEntry.push({
          "catalog_nbr" : course["catalog_nbr"].toString(),
          "subject" : course["subject"], 
          "className" : course["className"], 
          "class_section" : course["course_info"][0]["class_section"],  
          "ssr_component" : course["course_info"][0]["ssr_component"],
          "start_time" : course["course_info"][0]["start_time"],
          "end_time" : course["course_info"][0]["end_time"],
          "days" : course["course_info"][0]["days"],
          "reviews" : courseReviews
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
              courseReviews = []
              for(review of reviews){
                if(course['catalog_nbr'].toString().toUpperCase() == review["catalog_nbr"].toUpperCase() && course['subject'].toString().toUpperCase() == review["subject"].toUpperCase() && !review["isHidden"]){
                  courseReviews.push(review)
                }
              }
              tableEntry.push({
                "catalog_nbr" : course["catalog_nbr"].toString(),
                "subject" : course["subject"], 
                "className" : course["className"], 
                "class_section" : course["course_info"][0]["class_section"],  
                "ssr_component" : course["course_info"][0]["ssr_component"],
                "start_time" : course["course_info"][0]["start_time"],
                "end_time" : course["course_info"][0]["end_time"],
                "days" : course["course_info"][0]["days"],
                "reviews" : courseReviews
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

router.get('/publicCourseLists', (req, res) => {
  console.log("get request for 10 public course lists" )
  let publicCourseLists = []
  for(let i = 0; i < schedules.length && i < 10; i ++){
    console.log(schedules)
    if (schedules[i]["isPublic"]){
      publicCourseLists.push(schedules[i])
    }
  }
  publicCourseLists.sort(compareScheduleTime)
  return res.send(publicCourseLists)
});



// key word search with soft matching
router.get('/keyword/:keyword', (req, res) => {
  keyword = req.params.keyword
  tableEntry = []
  console.log("get request for keywords")
  if(keyword.length < 4){
    console.log(keyword.length)
    return res.status(404).send("word must be longer than 4 characters")
  }
  
  for(course of courses){
    if(stringSimilarity.compareTwoStrings(course['catalog_nbr'].toString(), keyword) > 0.6 || stringSimilarity.compareTwoStrings(course['className'], keyword) > 0.6){
      courseReviews = []
      for(review of reviews){
        if(course['catalog_nbr'].toString().toUpperCase() == review["catalog_nbr"].toUpperCase() && course['subject'].toString().toUpperCase() == review["subject"].toUpperCase() && !review["isHidden"]){
          courseReviews.push(review)
        }
      }
      tableEntry.push({
        "catalog_nbr" : course["catalog_nbr"].toString(),
        "subject" : course["subject"], 
        "className" : course["className"], 
        "class_section" : course["course_info"][0]["class_section"],  
        "ssr_component" : course["course_info"][0]["ssr_component"],
        "start_time" : course["course_info"][0]["start_time"],
        "end_time" : course["course_info"][0]["end_time"],
        "days" : course["course_info"][0]["days"],
        "reviews" : courseReviews
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
      isPublic = strip(req.params.isPublic).toUpperCase()
    }
  }
  const schedule_name = strip(req.params.schedule_name)
  console.log("hello")
  if(schedules.find(s => s.name.toUpperCase() === schedule_name.toUpperCase())){
      res.status(404).send('Name is already present or invalid name')
      return
  }
  let publicSched = false
  if(isPublic == "YES"){
    publicSched = true
  }
  const newSchedule = {
      name: schedule_name,
      description: description,
      isPublic: publicSched,
      email: req.user["email"],
      username: req.user["username"],
      lastUpdated: new Date(), 
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

// delete a schdeule from the schdeule JSON file
router.delete('/schedules/:schedule_name', verifyToken, (req, res) => {
  console.log(`DELETE request from ${req.url}`, req.user);
  if(validate(req.params.schedule_name) || sanitization(req.params.schedule_name)){
      res.status(404).send('invalid input')
      return
  }
  const schedule_name =req.params.schedule_name
  const schedule = schedules.find(s => s.name.toUpperCase() === schedule_name.toUpperCase() && s.email.toUpperCase() == req.user["email"].toUpperCase())
  if(!schedule){
      res.status(404).send('No schedules by this name')
      return
  }
  const index = schedules.indexOf(schedule)
  schedules.splice(index,1)
  var data = JSON.stringify(schedules, null, 2)
  fs.writeFile('schedules.json', data, (err) => {
      if (err) throw err;
    });

  res.send(schedule)
});

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

router.get('/publicSchedules', (req, res) => {
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

// edit a schedule
router.put('/editSchedule', verifyToken, (req, res) => {
  let scheduleName = null
  let newName = null
  let description = null
  let isPublic = null
  let addCourse = null
  let deleteCourse = null
  let currSchedule = null

  if (!req.body.scheduleName){
    res.status(400).send('we need a schedule name')
      return 
  }
  
  if(validate(req.body.scheduleName) || sanitization(req.body.scheduleName)){
      res.status(400).send('invalid input')
      return 
  }
  else{
    scheduleName = req.body.scheduleName
    for(schedule of schedules){
      if((scheduleName == schedule["name"].toUpperCase()) && (schedule["email"].toUpperCase() == req.user["email"].toUpperCase())){
        currSchedule = schedule
      }
    }
    if (currSchedule == null){
      return res.status(404).send("no schedule with that name")
    }
  } 
  
  if(req.body.newName.length > 0){
    if(validate(req.body.newName) || sanitization(req.body.newName) ){
    res.status(400).send('invalid input')
    return 
    }
    else{
      newName = req.body.newName
      currSchedule["name"] = newName
    }
  }

  if(req.body.description.length > 0){
    if(validate(req.body.description) || sanitization(req.body.description) ){
    res.status(400).send('invalid input')
    return 
    }else{
      description = req.body.description
      currSchedule["description"] = description
    } 
  }
  if(req.body.isPublic.length > 0){
    if(validate(req.body.isPublic) || sanitization(req.body.isPublic) ){
    res.status(400).send('invalid input')
    return 
    } 
    else{
      isPublic = req.body.isPublic
      if(isPublic == "YES"){
        currSchedule["isPublic"] = true
      }
      if(isPublic == "NO"){
        currSchedule["isPublic"] = false
      }
    }
  }
  if(req.body.addCourse.length > 0){
    if(validate(req.body.addCourse) || sanitization(req.body.addCourse) || req.body.addCourse.split(" ").length != 2){
    res.status(400).send('invalid input')
    return 
    }
    else{
      addCourse = req.body.addCourse.length
      addCourseSubject = req.body.addCourse.split(" ")[0]
      addCourseNumber = req.body.addCourse.split(" ")[1]
      isCourse = false
      for (course of courses){
        // console.log(course)
        // console.log(addCourseSubject , course["subject"].toUpperCase() , addCourseNumber , course["catalog_nbr"].toString().toUpperCase())
        if (addCourseSubject == course["subject"].toUpperCase() && addCourseNumber == course["catalog_nbr"].toString().toUpperCase()){
          currSchedule["courses"].push({
            "catalog_nbr" : course["catalog_nbr"].toString(),
            "subject" : course["subject"], 
            "className" : course["className"], 
            "class_section" : course["course_info"][0]["class_section"],  
            "ssr_component" : course["course_info"][0]["ssr_component"],
            "start_time" : course["course_info"][0]["start_time"],
            "end_time" : course["course_info"][0]["end_time"],
            "days" : course["course_info"][0]["days"],
          })
          isCourse = true
        }
      }
      if (!isCourse) res.status(400).send("no course with that name to add")
    } 
  }

  if(req.body.deleteCourse.length > 0){
    if(validate(req.body.deleteCourse) || sanitization(req.body.deleteCourse) || req.body.deleteCourse.split(" ").length != 2){
    res.status(400).send('invalid input')
    return 
    }
    else{
      deleteCourse = req.body.deleteCourse
      deleteCourseSubject = req.body.deleteCourse.split(" ")[0]
      deleteCourseNumber = req.body.deleteCourse.split(" ")[1]
      isCourse = false
      for(let i = 0; i < currSchedule["courses"].length; i++){
        course = currSchedule["courses"][i]
        if(deleteCourseSubject == course["subject"].toUpperCase() && deleteCourseNumber == course["catalog_nbr"].toString().toUpperCase()){
          currSchedule["courses"].splice(i, 1)
          isCourse = true
        }
      }
      if (!isCourse) res.status(400).send(" no course with that name to delete")
    }
  }

  currSchedule["lastUpdated"] = new Date()
  console.log(new Date())
  var data = JSON.stringify(schedules, null, 2)
  fs.writeFile('schedules.json', data, (err) => {
      if (err) throw err;
    });
  res.send(currSchedule) 
});
// add review to course
router.put('/addReview', verifyToken, (req, res) => {
  console.log("get put request to get add review!")
  if(validate(req.body.courseName) || sanitization(req.body.courseName) || validate(req.body.review) || sanitization(req.body.review) || req.body.courseName.split(" ").length != 2){
    res.status(400).send('invalid input')
    return 
    } 
  else{
    let courseID = req.body.courseName.split(" ")
    courseNumber = courseID[1]
    subject = courseID[0]
    isCourse = false
    for(course of courses){
      if(subject.toUpperCase() == course["subject"].toUpperCase() && courseNumber.toUpperCase() == course["catalog_nbr"].toString().toUpperCase()){
        var today = new Date();
        var day = String(today.getDate()).padStart(2, '0');
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var year = today.getFullYear();
        var hours = today.getHours()
        var minutes = today.getMinutes()
        today = month + '/' + day + '/' + year + " - " + hours + ":" + minutes;
        reviews.push({
          subject: course["subject"],
          catalog_nbr: course["catalog_nbr"].toString(),
          review: req.body.review, 
          isHidden: false, 
          reviewID : reviews.length + 1,
          userName: req.user["username"],
          creationDate: today
        })
        isCourse = true
      } 
    }
    if(!isCourse) res.status(400).send("this is not a valid course")
  }
  var data = JSON.stringify(reviews, null, 2)
  fs.writeFile('reviews.json', data, (err) => {
      if (err) throw err;
    });
  res.send(reviews) 

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
function compareScheduleTime(a, b){
  if (a["lastUpdated"] > b["lastUpdated"]) return -1;
  if (a["lastUpdated"] < b["lastUpdated"]) return 1;
}