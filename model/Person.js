const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  work: {
    type: String,
    enum: ['manager', 'developer', 'coordinator']
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  }
});

personSchema.pre('save', async function(next){
  const userInfo = this;
  // Password Hashing is not required if not inserting new record or updating password
  if (!userInfo.isModified('password')) return next();
  try {
    // Generating Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userInfo.password, salt);
    userInfo.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
})

personSchema.methods.comparePassword = async function(enteredPassword){
  try {
    const isMatched = await bcrypt.compare(enteredPassword, this.password);
    return isMatched;
  } catch (err) {
    throw err;
  }
}

module.exports = mongoose.model("Person", personSchema);
