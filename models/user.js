const mongoose=require('mongoose'); // Import
const Schema=mongoose.Schema; // To tell mongoose about particular field
const bcrypt=require('bcrypt-nodejs');// To encrypt the pwd while storing in mongoDB

//Define our user login model (email and password to login)
// email - to be a string, to be unique, to be saved as lowercase
const userSchema=new Schema({
  email:{type:String, unique:true,lowercase:true},
  password:String
});

// On Save hook, encrypt password
// '.pre(' Before saving a model, run this function
userSchema.pre('save',function(next) {
  // Get access to user model
  const user=this;

// Generate a salt with callback function. It should run after the salt has been created
  bcrypt.genSalt(10,function(err,salt){
    if(err){return next(err);}

    // hash(encrypt) the password using the salt + texted password
    bcrypt.hash(user.password,salt, null, function(err,hash){
      if(err){return next(err);}

      // Assign the new encrypted password to the password
      user.password=hash;
      next();

    });

  });

});

// Function to validate user entered password with hashed password in mongodb
// Whenever a user object is created, it will have access to any function in this methods property
userSchema.methods.comparePassword=function(candidatePassword,callback){
   //this.password - hased and salted password
  bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
    // for error during comparison, callback the error
      if(err){return callback(err);}

      // if no error, send no error and isMatch (true if matches, false if doesn't match)
      callback(null,isMatch);
  });
}


// Create the model class
const ModelClass=mongoose.model('user',userSchema); // Load the user schema to mongoose

// Export the model
module.exports=ModelClass;
