// This JWS Strategy module is used to authenticate an already logged in user with the token id generated earlier
const passport=require('passport'); // for authentication if already logged in
const User=require('../models/user');// custom file import
const config=require('../config');// custom file import
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;

// Local Strategy - for login with user's email and password. i.e. tries to login afresh(account already created and available in mongoDB) i.e. Signing IN option
const LocalStrategy=require('passport-local');
const localOptions={usernameField:'email'};
const localLogin=new LocalStrategy(localOptions,function(email,password,done){
  // VErify if this email and password match
  // IF Valid, call 'done' with user
  // IF invalid, call 'done' with false

  // CHeck if email is already present in mongodb
  User.findOne({email:email},function(err,user){
    // Any database errors, return 'done' with error
    if(err){return done(err); }

    // IF user is not found in the mongodb, return 'done' with no error and false
    if(!user){return done(null,false)};

    // When user is present, Next step is compare passwords(user entered and hashed encryped password)
    // comparePassword - function in \models\user.js
    // password - password from the request
    user.comparePassword(password,function(err,isMatch){
      // ANy error in processing, return 'done' with error
      if(err){return done(err);}

      // if passwords don't match, return 'done' with no error and false
      if(!isMatch){return done(null,false);}

      // if passwords match, return 'done' with no error and user
      return done(null,user);
    });

  });
});

// Set up options the jwt Strategy - Token authorization
// Whenever a request comes in and passport has to handle it, it looks into the request header 'authorization' to find the token as first param, and the second param is the config.secret
const jwtOptions={
  jwtFromRequest:ExtractJwt.fromHeader('authorization'),
  secretOrKey:config.secret
};

// Create JWT Strategy
//jwt.encode({sub:user.id,iat:timestamp},config.secret);
const jwtLogin=new JwtStrategy(jwtOptions,function(payload,done){
  // See if the user ID in the payload exists in our database.
  // If exists, call 'done' with that user Object
  // If not exists, call 'done' without the user Object
  // payload.sub contains the user.id
    User.findById(payload.sub,function(err,user){
      // If Search fails - no access to database
        if(err) {return done(err,false);}

        if(user){
          // done(error, user)
          done(null,user); //no error and a user
        }else{
          done(null,false);// no error and no user found
        }

    });

});

// Tell passport to use this Strategy
passport.use(jwtLogin); // For jwt token authentication

passport.use(localLogin); // For local sign in
