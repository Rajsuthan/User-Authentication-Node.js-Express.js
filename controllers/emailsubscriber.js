const sgMail = require("@sendgrid/mail");
const EmailSubscriber = require("../models/emailsubscriber");

exports.addEmailSubscriber = (req, res) => {
  const emailSubscriber = new EmailSubscriber(req.body);

  emailSubscriber.save((err, email) => {
    if (err) {
      return res.status(400).json({
        error: "unable to save email",
      });
    }

    // Send Automatic email
    this.sendGridEmail(
      email,
      "Newsletter Successfully Subscribed",
      "Thanks for Subscribing for the Newsletter, we will send you discount and more!!!!"
    );
    return res.json({
      message: "Successfully Added to Subscription list",
      email,
    });
  });
};

exports.getAllSubscribers = (req, res) => {
  EmailSubscriber.find().exec((err, email) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to Get All Email Subscribers",
      });
    }

    return res.json(email);
  });
};

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

// SendGrid Email for Newsletter
exports.sendGridEmailResetPassword = (email, subject, message, code) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "example@example.com", // Please use your Sendgrid email
    subject: subject,
    text: `${message}\n\n This is your verification code: ${code}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
