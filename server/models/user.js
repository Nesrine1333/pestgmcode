const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 name: {
    type: String,
    required: true,

  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

// Hash user password before saving into database
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

module.exports = mongoose.model("User", UserSchema);