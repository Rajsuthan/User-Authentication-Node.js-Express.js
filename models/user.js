const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      maxlength: 20,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    aboutme: {
      type: String,
      maxlength: 2000,
      trim: true,
    },
    videoUrl: {
      type: String,
      maxlength: 400,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    projects: {
      type: [ObjectId],
      ref: "Project",
    },
    skills: {
      type: [ObjectId],
      ref: "Skill",
    },
    experiences: {
      type: [ObjectId],
      ref: "Experience",
    },
    social_media: {
      twitter: {
        type: String,
        maxlength: 100,
        trim: true,
      },
      instagram: {
        type: String,
        maxlength: 100,
        trim: true,
      },
      linkedin: {
        type: String,
        maxlength: 100,
        trim: true,
      },
      behance: {
        type: String,
        maxlength: 100,
        trim: true,
      },
      dribbble: {
        type: String,
        maxlength: 100,
        trim: true,
      },
    },
    verification_code: {
      type: Number,
      default: null,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
