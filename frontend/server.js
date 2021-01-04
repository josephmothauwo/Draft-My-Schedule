if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  // all dependencies are listed 
const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require("bcryptjs")
const stringSimilarity = require('string-similarity');
var validator = require("email-validator");
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
var policiesData = fs.readFileSync("policies.json")
var policies = JSON.parse(policiesData)
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

// this is for email confirmation that will be posted to the user
router.get("/confirmation/:token", (req,res)=>{
  console.log(req.params.token)
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

router.post('/register', (req,res)=>{
  // registration with all checks if the right information is given
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
        if(!validator.validate(req.body.email)){
          res.status(404).send("not a valid email")
          return
        }
        // validate input
        console.log(validate(req.body.email) , sanitizationEmail(req.body.email) , validate(req.body.password) , sanitization(req.body.password) , validate(req.body.username) , sanitization(req.body.username))
        if(sanitizationEmail(req.body.email) || validate(req.body.password) || sanitization(req.body.password) || validate(req.body.username) || sanitization(req.body.username)){
          res.status(404).send('invalid input or no username')
          return
        }
        console.log("hello")
        const foundUser = users.find(user => user.email.toUpperCase() === req.body.email.toUpperCase());
        if(foundUser){
          res.status(404).send("this email already exisits")
          return
        }
        // hashed password
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        console.log(req.body.password,hashedPassword, "this is the hashed password")
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
        jwtUser = {
          email :req.body.email,
          username :req.body.username,
        }
        console.log(tempUser)
        const accessToken = jwt.sign(jwtUser, process.env.ACCESS_TOKEN_SECRET)
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
// get courses with a subject and coursecode
router.get('/courses/:subject?/:course_code?', (req, res) => {
  console.log(req.params.subject, req.params.course_code)
  
  // filter course codes
  // no course code given
  tableEntry = []
  if(!req.params.course_code){
    if(validate(req.params.subject) || sanitization(req.params.subject)){
      res.status(404).send('invalid input')
      return
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
              "facility_ID": course["course_info"][0]["facility_ID"],
              "reviews": courseReviews
            })
          }
      }
  }
  // no subject given
  else if(req.params.subject == "NONE"){
    
    if(validate(req.params.course_code) || sanitization(req.params.course_code)){
      res.status(404).send('invalid input')
      return
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
          "facility_ID": course["course_info"][0]["facility_ID"],
          "reviews" : courseReviews
        })
      }
    }
  }
  // both  subject and coursecode are given
  else{
      if(validate(req.params.course_code) || sanitization(req.params.course_code) || validate(req.params.subject) || sanitization(req.params.subject)){
          res.status(404).send('invalid input')
          return
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
                "facility_ID": course["course_info"][0]["facility_ID"],
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
// get all the public course lists and sort them
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
// set new passwrord and check if the passwords are the same
router.put('/newPassword', verifyToken, (req, res) => {
  let newToken = null
  console.log(req.body.newPassword, req.body.confirmedPassword)
  if(validate(req.body.newPassword) || sanitization(req.body.confirmedPassword)){
    res.status(404).send('invalid input')
    return
  }
  if(req.body.newPassword != req.body.confirmedPassword){
    res.status(404).send('passwords must match!')
    return
  }
  for(user of users){
    if (req.user["email"].toUpperCase() == user["email"].toUpperCase()){
      user["password"] = bcrypt.hashSync(req.body.newPassword, 10)
      jwtUser = {
        email :user["email"],
        username :user["username"],
      }
      newToken = jwt.sign(jwtUser, process.env.ACCESS_TOKEN_SECRET)
      user["loginToken"] = newToken
      console.log(user)
    }
  }
  var data = JSON.stringify(users, null, 2)
  fs.writeFile('users.json', data, (err) => {
      if (err) throw err;
    });
  res.send([newToken]) 
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
// login without passport
router.post('/login', (req, res) => {
  // validation and sanitization
  if(sanitizationEmail(req.body.email) || validate(req.body.password) || sanitization(req.body.password)){
    res.status(404).send('invalid input')
    return
  }
  authenticatedUser = null
  for(user of users){
    // console.log(user.password, req.body.password)
    console.log(user.email.toUpperCase() , req.body.email.toUpperCase() )
    if(user.email.toUpperCase() == req.body.email.toUpperCase() && bcrypt.compareSync( req.body.password, user.password)){
      authenticatedUser = user
    }
  }
  console.log(authenticatedUser)
  if (authenticatedUser == null) {
    res.status(401).send("username or password is wrong")
    return
  }
  
  //   console.log(info);
  else if(!authenticatedUser.isVerified){
    console.log("not verified");
    var sendback = {
      message:"not verified",
      user: user
    }
    res.send(sendback).status(401)
    return
  }
  
  else if(authenticatedUser.isDeactivated){
    console.log(user)
    res.status(401).send("Your account has been deactivated please the call the admin at: 123-456-7890");
    return
  } 
  else {
    const username = authenticatedUser.username;
    tempUser = {
      email :authenticatedUser.email,
      username :authenticatedUser.username,
    }
    const accessToken = jwt.sign(tempUser, process.env.ACCESS_TOKEN_SECRET)
    authenticatedUser.loginToken = accessToken
    const access = {
      message:"logged in!",
      user: authenticatedUser,
      accesstoken: accessToken
    }
    var data = JSON.stringify(users, null, 2)
    fs.writeFile('users.json', data, (err) => {
      if (err) throw err;
    });
    res.status(200).send(access);
  } 
});

// add a new schdeule to the schdeules json file
router.put('/schedules/:schedule_name/:isPublic/:description?', verifyToken, (req, res) => {
  console.log("hello")
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
// check if the new schedule is public
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
  if(schedules.find(s => s.name.toUpperCase() === schedule_name.toUpperCase() && req.user.email.toUpperCase() == s.username.toUpperCase())){
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

// get all the schedules for a given user
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

// get one schedules given the name
router.get('/schedule/:scheduleName',verifyToken, (req, res) => {
  console.log(`GET request from ${req.url}`);
  if(validate(req.params.scheduleName) || sanitization(req.params.scheduleName)){
    res.status(404).send('invalid input')
    return
  } 
  userEmail = req.user["email"]
  let currSchedule = null
  for(schedule of schedules){
      if(userEmail.toUpperCase() == schedule["email"].toUpperCase() && req.params.scheduleName.toUpperCase() == schedule.name.toUpperCase() ){
        currSchedule = schedule
      }
    }
  if (currSchedule == null){
    res.status(404).send("no schedule with that name!")
    return
  }
  else{
    res.send(currSchedule)
    return
  }
});
// get all the public schedules to show to UA users
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



// edit a schedule for a given user
router.put('/editSchedule', verifyToken, (req, res) => {
  let scheduleName = null
  let newName = null
  let description = null
  let isPublic = null
  let addCourse = null
  let deleteCourse = null
  let currSchedule = null
// check which operations to do
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
  // add change public status
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
  // add a course
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
            "facility_ID": course["course_info"][0]["facility_ID"]
          })
          isCourse = true
        }
      }
      if (!isCourse) res.status(400).send("no course with that name to add")
    } 
  }
// delete course
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
// add the date updated
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
  if(validate(req.body.courseName) || sanitization(req.body.courseName) || sanitization(req.body.review) || req.body.courseName.split(" ").length != 2){
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
// make someone an admin 
router.put('/givePriveleges', verifyToken, (req, res) => {
  if(validate(req.body.email) || sanitizationEmail(req.body.email)){
    res.status(400).send('invalid input')
    return 
  }
  console.log("put request to change priveleges")
  console.log(req.body.email)
  var currUser = null
  for(user of users){
    if(user.email.toUpperCase() == req.body.email.toUpperCase()){
      user.isAdmin = true
      currUser = user
    }
  }
  if(!currUser) res.status(404).send("user not found")
  var data = JSON.stringify(users, null, 2)
  fs.writeFile('users.json', data, (err) => {
      if (err) throw err;
    });
  res.send(currUser) 

});
// ability to hide a review and make it not public for DMCA
router.put('/hideReview', verifyToken, (req, res) => {
  console.log("put request to hide review")
  if(sanitization(req.body.id)){
    res.status(400).send('invalid input')
    return 
  }
  var currReview = null
  for(review of reviews){
    if(review.reviewID.toString() == req.body.id){
      review.isHidden = true
      currReview = review
    }
  }
  if(!currReview) res.status(404).send("review not found")
  var data = JSON.stringify(reviews, null, 2)
  fs.writeFile('reviews.json', data, (err) => {
    if (err) throw err;
  });
  res.send(currReview) 
});
// ability to show review again in case of counter notice in DMCA
router.put('/showReview', verifyToken, (req, res) => {
  console.log("put request to hide review")
  if(sanitization(req.body.id)){
    res.status(400).send('invalid input')
    return 
  }
  var currReview = null
  for(review of reviews){
    if(review.reviewID.toString() == req.body.id){
      review.isHidden = false
      currReview = review
    }
  }
  if(!currReview) res.status(404).send("review not found")
  var data = JSON.stringify(reviews, null, 2)
  fs.writeFile('reviews.json', data, (err) => {
    if (err) throw err;
  });
  res.send(currReview) 
});
// ability to deactivate user in the case they do not abide by site rules
router.put('/deactivate', verifyToken, (req, res) => {
  console.log("put request to deactivate user")
  if(sanitizationEmail(req.body.email) || validate(req.body.email)){
    res.status(400).send('invalid input')
    return 
  }
  var currUser = null
  for(user of users){
    if(user.email.toUpperCase() == req.body.email.toUpperCase()){
      user.isDeactivated = true
      currUser = user
    }
  }
  if(!currUser) res.status(404).send("user not found")
  var data = JSON.stringify(users, null, 2)
  fs.writeFile('users.json', data, (err) => {
    if (err) throw err;
  });
  res.send(currUser) 
});
// ability to reactivate user in case they are given access again
router.put('/reactivate', verifyToken, (req, res) => {
  console.log("put request to deactivate user")
  if(sanitizationEmail(req.body.email) || validate(req.body.email)){
    res.status(400).send('invalid input')
    return 
  }
  var currUser = null
  for(user of users){
    if(user.email.toUpperCase() == req.body.email.toUpperCase()){
      user.isDeactivated = false
      currUser = user
    }
  }
  if(!currUser) res.status(404).send("user not found")
  var data = JSON.stringify(users, null, 2)
  fs.writeFile('users.json', data, (err) => {
    if (err) throw err;
  });
  res.send(currUser) 
});
// this will update the given policy with the new poicy
router.put('/policy', verifyToken, (req, res) => {
  console.log("put request to policy update")
  if(sanitizationPolicy(req.body.policy)){
    res.status(400).send('invalid input')
    return 
  }
  for(policy of policies){
    if (req.body.policyName.toUpperCase() == policy.policyName.toUpperCase()){
      policy["policy"] = req.body.policy
    }
  }
  var data = JSON.stringify(policies, null, 2)
  fs.writeFile('policies.json', data, (err) => {
    if (err) throw err;
  });
  res.send([req.body.policy]) 
});
// this will get the policies stored in the db and post them
router.get('/getPolicies', (req, res) => {
  console.log("get request to get policies")
  res.send(policies) 
});
// validation that string is a certian length
function validate(inputString){
  return ((inputString.length<2) || (inputString.length>20))
}

// check for special characters in the string
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
// special check for emails because they have special characters
function sanitizationEmail(inputString){
  const format = /[`!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/g;
  const output = inputString.replace(format, "");

  if (inputString  === output){
      return false
  }
  else{
      return true;
  }
}
// special check for policy because they should be allowed puncuation
function sanitizationPolicy(inputString){
  const format = /[`#$%^&*()_+\=\[\]{}"\\|<>\?~]/g;
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
// comparisin for sorting the order of public strings based on last updated time
function compareScheduleTime(a, b){
  if (a["lastUpdated"] > b["lastUpdated"]) return -1;
  if (a["lastUpdated"] < b["lastUpdated"]) return 1;
}