import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Schema defines the Structure of the document, default values, validators
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide Name"],
    trim: true,
    minlength: [3, "Name should have minimum 3 characters"],
    maxlength: [20, "Name should have maximum 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide Email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a Valid Email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide Password"],
    trim: true,
    minlength: [6, "Password should have minimum 3 characters"],
    select: false,
  },
  lastName: {
    type: String,
    trim: true,
    minlength: [3, "lastName should have minimum 3 characters"],
    maxlength: [20, "lastName should have maximum 20 characters"],
    default: "Last Name",
  },
  location: {
    type: String,
    trim: true,
    default: "My City",
  },
});

// NOTE: always define instance or static methods on each document or on the model before exporting the model.

// NOTE: don't use arrow functions beacuse this points to window object, so value of this is undefined.

// this runs on each document before saving to the database
UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths()); // returns as array
  // console.log(this.isModified("name")); // returns boolean value

  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// defining instance method to create JWT
UserSchema.methods.createJWT = function () {
  // console.log(this); this keyword is pointing to UserSchema

  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// defining instance method to compare passwords
UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

// Model provides an interface or (wapper on the mongoose schema) to the database for creating, querying, updating , deleting records.
const User = mongoose.model("User", UserSchema);
export default User;
