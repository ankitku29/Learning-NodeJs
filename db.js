const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/hotel";

mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log("sucessfully conected to the database server")
})

db.on('error', (err)=>{
    console.error("error in connecting to the database server", err);
})

db.on('disconnected', ()=>{
    console.log("disconected to the database server")
})

module.exports = db;