const mongoose=require("mongoose");
const { v1: uuidv1 } = require('uuid');
const crypto=require("crypto");
const userSchema=new mongoose.Schema({
    name:{
        type : String, 
        trim : true,
        unique:true,
        required: true,
        maxlength : 32,
    },
    email:{
      type:String,
      trim:true,
      unique:true,
      required:true,
      maxlength:50
     
    },
    hashed_password:{
        type:String,
        required:true
    },
    // to update user profile
    about:{
        type:String,
        // require:true,
    },
    salt:String,
    role:{
      type:Number,//0 FOR REQULAR USER,1:ADMIN,
    //  required:true
    },
    history:{
        type:Array,
        default:[]
    }   
},{timestamp:true});
// virtual field:- it is use to manuplate data(it actually doesnot exist in databases but it dynamically manipulate the data over that).
userSchema.virtual('password')// this virtual field doesnot exists in our database actually it saved temporary 
.set(function(password){
    this._password=password;//This function used to take password from user and encrypt it and set it to actual field in data base whis=ch is hashed password.
    this.salt=uuidv1();
    this.hashed_password=this.encryptPassword(password);
}).get(function(){
    return this._password  // when want to see actual password
});
// now we write method encryptPassword which encrypt the actual password which we are taking from the user.
userSchema.methods = {
    // authenticate : function(plaintext){
    //     return this.encryptPassword(plaintext)===this.hashed_password
    // },
    encryptPassword: function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        }
        catch(err){
            return "";
        }
    }
}
userSchema.methods.authenticate = function(plaintext) {
    return this.encryptPassword(plaintext) === this.hashed_password; // Compare the hashed password
};
module.exports = mongoose.model("User",userSchema);

