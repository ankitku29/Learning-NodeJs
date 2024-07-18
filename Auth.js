const express = require("express");
const app = express();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const person = require('./model/Person');

app.use(passport.initialize());
passport.use(new localStrategy(async (USERNAME, PASSWORD, done) => {
  try {
    const user = await person.findOne({ username: USERNAME });
    if (!user) {
      return done(null, false, { message: "Username not found" })
    }
    const isPasswordMatch = user.comparePassword(PASSWORD);
    if (isPasswordMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect Password" });
    }
  } catch (err) {
    return done(err);
  }
}))
const localAuthMiddleware = passport.authenticate('local', { session: false });
module.exports = localAuthMiddleware;

