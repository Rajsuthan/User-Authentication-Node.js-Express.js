const User = require('../models/user')
var jwt = require("jsonwebtoken")
var expressJwt = require("express-jwt")
const { validationResult, check } = require('express-validator')
const user = require('../models/user')
const {sendGridEmail, sendGridEmailResetPassword} = require('./emailsubscriber')

// API Key check
exports.apiAuth = (req, res, next) => {
  if(req.headers['api-key']) {  
    let apiKey = req.headers['api-key']

    if(apiKey !== process.env.API_KEY) {
      return res.status(400).json({
        message: "Invalid API Key"
      })
    }
    next()
  } else {
    return res.status(400).json({
      message: "Missing API Token"
    })
  }
}

exports.signup = (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(402).json({
      error: errors.array()[0].msg
    })
  }

  // Check whether email already exists
  const {email} = req.body
  User.findOne({email}, (err, email) => {
    if(err || email) {
      return res.status(403).json({
        error: "Email already exists"
      })
    }

    // If email don't exist, create user
    const user = new User(req.body)
    user.save((err, user) => {
      if(err) {
        return res.status(400).json({
          error: "Unable to save user to DB",
          err
        })
      }
      // Send Email
      sendGridEmail(user.email, "Thanks for Signing up to Alerge", `You have successfully signed up to Alerge & this is your User ID: ${user._id} \n\n Please keep this careful.. \n\n Happy Coding, \n Alerge Team`)
      res.json({
        message: "Successfully added user",
        user: {
          name: user.name,
          email: user.email,
          id: user._id
        }
      })
    })
  })
}

exports.signin = (req, res) => {
  const {email, password} = req.body

  User.findOne({email}, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: "Email does not exists"
      })
    }

    if(!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password does not match"
      })
    }

    // Send Email
    sendGridEmail(user.email, "Signin Alert", "You have signed in to Alerge Right now. This is an alert... \n\n Happy Coding, \n Alerge Team")

    // create a token
    const token = jwt.sign({_id: user._id}, process.env.SECRET)

    // Put token in cookie
    res.cookie("token", token, { expire: new Date() + 100 })

    // Send response to front end
    const { _id, name, email, role } = user
    return res.json({token, user: { _id, name, email, role }})
  })
}


exports.signout = (req, res) => {
  res.clearCookie("token")
  res.json({
    message: "User signout successfull"
  })
}

// Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"
})

// Custom MiddleWares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id
  if(!checker) {
    return res.status(403).json({
      error: "Access Denied"
    })
  }

  next()
}

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0) {
    return res.status(403).json({
      error: "Your are not an Admin, Access Denied"
    })
  }

  next()
}

// Send verification code
exports.sendVerificationCode = (req, res) => {
  const {email} = req.body
  User.find({email}, (err, user) => {
    if(err || user.length==0) {
      return res.status(400).json({
        error: "Email do not exist"
      })
    }

    id = user[0]._id
    let val = Math.floor(10000 + Math.random() * 9000);

    User.findByIdAndUpdate(
      { _id: id },
      { $set: {verification_code: val} },
      { new: true, useFindAndModify: false },
      (err, user) => {
        if (err) {
          return res.status(400).json({
            error: "You are not authorized to update this user"
          });
        }

        sendGridEmailResetPassword(user.email, "Alerge Verfication", "This is your verification code" , user.verification_code)
        user.salt = undefined;
        user.encry_password = undefined;
        res.json({
          status: "Success",
          id: user._id,
          message: "Verification code successfully sent"
        });
      }
    );

  })
}


// Reset Password
exports.resetPassword = (req, res) => {
  const {id, verificationCode} = req.body
  User.findById(id).exec((err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: "User do not exist"
      })
    }

    if(verificationCode === null) {
      return res.status(400).json({
        error: "Please add a valid code"
      })
    }

    if(user.verification_code !== verificationCode) {
      return res.status(400).json({
        error: "Verification code does not match"
      })
    }

    if(!req.body.newPassword) {
      return res.status(200).json({
        message: "Please input a valid password"
      })
    }

    const {newPassword} = req.body

    if(newPassword.length < 6) {
      return res.json({
        error: "Password should be at least 6 characters"
      })
    }


    let encryPassword = user.securePassword(newPassword)

    if(encryPassword == user.encry_password) {
      return res.json({
        error: "You cannot update the same password"
      })
    }


    User.findByIdAndUpdate(
      { _id: id },
      { $set: {verification_code: undefined, encry_password: encryPassword} },
      { new: true, useFindAndModify: false },
      (err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to update new password"
          });
        }

        sendGridEmail(user.email, "Your Password was changed", `Your password had been chnaged..... \n\n Happy Coding, \n Alerge Team`)
        res.json({
          status: "Success",
          id: user._id,
          message: "Password was successfully changed"
        });
      }
    );
  })
}

// Contact us email
exports.contactEmail = (req, res) => {
  if(!req.body.email || !req.body.subject || !req.body.message) {
    return res.status(400).json({
      error: "Some Input's are empty"
    })
  }

  const {email, subject, message} = req.body
  // First send Alerge team the message
  sendGridEmail("rajsuthan666@gmail.com", subject, `Email: ${email} \n\n ${message}`)

  // Then send success email to user
  sendGridEmail(email, "Email Recieved", "Your Message/Inquiry was successfully recieved. \n Alerge Team will get back to you soon as possible. \n\n Happy Coding\n Alerge Team with ❤️")

  return res.json({
    message: "Email Successfull sent"
  })
}