const sgMail = require('@sendgrid/mail')
const EmailSubscriber = require("../models/emailsubscriber");
const fs = require('fs');
let ejs = require('ejs')

exports.addEmailSubscriber = (req, res) => {
  const emailSubscriber = new EmailSubscriber(req.body);

  emailSubscriber.save((err, email) => {
    if (err) {
      return res.status(400).json({
        error: "unable to save email",
      });
    }

    // Send Automatic email
    this.sendGridEmail(email, "Alerge Newsletter Subscribed", "Thanks for Subscribing for Alerge Newsletter, we will send you discount and more!!!!")
    return res.json({
      message: "Successfully Added to Subscription list",
      email,
    });
  });
};


exports.getAllSubscribers = (req, res) => {
  EmailSubscriber.find().exec((err, email) => {
    if(err) {
      return res.status(400).json({
        error: "Unable to Get All Email Subscribers"
      })
    }

    // this.sendGridEmail(email, "Weekly Newsletter!!!", "Hey there, I hope everyone are doing good. This week Alerge Launched it's new Exclusive platform, please check it out now.. \n\n Happy Coding, \n Alerge Team")
    return res.json(email)
  })
}


exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to get All users",
      });
    }

    res.json(users);
  });
};

// Email Template
const renderAndSaveHtml = async (message, code) => {
  const html = await ejs.renderFile('template.ejs', {message, code})
  fs.writeFileSync('sample.html', html);
}

// SendGrid Email for Newsletter
exports.sendGridEmail = (email, subject, message) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: email, 
    from: 'rajsuthan666@gmail.com', 
    subject: subject,
    text: message
  }
  sgMail
    .send(msg)
    .then(() => {
     console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

// SendGrid Email for Newsletter
exports.sendGridEmailResetPassword = (email, subject, message, code) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: email, 
    from: 'rajsuthan666@gmail.com', 
    subject: subject,
    text: `${message}\n\n This is your verification code: ${code}`
  }
  sgMail
    .send(msg)
    .then(() => {
     console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}