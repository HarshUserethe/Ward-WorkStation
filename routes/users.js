
const { Db } = require('mongodb');
var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

const URI ='mongodb+srv://useretheharsh2211:m39pwMRf2oHG1K53@cluster0.84s95os.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(URI)
.then(function(){
  console.log("Connected to DB");
});

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  ward: Number,
  password: String
});

userSchema.plugin(plm, { usernameField: "email" });
module.exports = mongoose.model("user", userSchema);