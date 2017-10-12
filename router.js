const Authentication=require('./controllers/authentication');

// For passport authentication before sending it to Router
const passportService=require('./services/passport');
const passport=require('passport');

// When the user is authenticated, don't try to create user session and so session:false
const requireAuth=passport.authenticate('jwt',{session:false});

// For Sign In.. don't create user session
const requireSignIn=passport.authenticate('local',{session:false});

// NodeJS export statement syntax 'module.exports'
module.exports =function(app){
  // Expecting a GET request to come in
  // req - request got, res - response to send back, next - error handling
  /*
  // Static data test
  app.get('/',function(req,res,next){
    res.send(['water','air','land']); // Send some dummy test JSON response

  });*/

// Any GET request which comes in with path '/' should first pass through the requireAuth step and then go to the request handler
  app.get('/',requireAuth,function(req,res){
    //res.send({hi:'there'});
    res.send({message:'Kishor, the Super secrect code is ABC123'});
  });

  /*
  1. Test in Postman to login without account or token
    (a)Send a GET request localhost:3090/
    (b)Check output

  Output:
  Unauthorized
  ===================================================================
  2. Test in Postman by  creating an account
    (a)Send a POST request localhost:3090/signup
    {
      "email":"testanand@example.com",
      "password":"12343"
    }
    (b)Check output

  Output:
  {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTcxOGU5MGNkNThhMzFmNTA0NmIwNWMiLCJpYXQiOjE1MDA2MTQyODg4ODB9.wpJd5StiPWX51OiQCO2CoU-kg_PkwOCP8aoQIuOsm60"
}
===================================================================
3. Test in Postman by logging in with token
  (a)Send a GET request localhost:3090/
  (b)Pass the token received in the 'Headers' TAB as key and value
      key=authorization
      value=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTcxOGU5MGNkNThhMzFmNTA0NmIwNWMiLCJpYXQiOjE1MDA2MTQyODg4ODB9.wpJd5StiPWX51OiQCO2CoU-kg_PkwOCP8aoQIuOsm60

  (c)Check output - the authorization with the token is successful
  {
    "hi": "there"
  }
  (d) try to update the token value with some junk chars in the header tab. This scenario is for incorrect tokens sent by hackers
   Output:
   Unauthorized


  */

  // Validate Sign In with email and password
  app.post('/signin',requireSignIn,Authentication.signin);
  /*
  1. Test in Postman to SignIn (already existing user, get the token for that user)
    (a)Send a POST request to signin localhost:3090/signin
    Input in the body tab (already created user)
    {
      "email":"testanand@example.com",
      "password":"12343"
    }
    (b)Check output

  Output:
  {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTcxOGU5MGNkNThhMzFmNTA0NmIwNWMiLCJpYXQiOjE1MDA2MTgzNzI1NDV9.IKQiAfkYyhq40STUYiGDHkFs4zT_nfBW7LEvGyZQI6o"
}

===================================================================
2. Test in Postman by logging in with token generated from Sign In
  (a)Send a GET request localhost:3090/
  (b)Pass the token received in the 'Headers' TAB as key and value
      key=authorization
      value=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTcxOGU5MGNkNThhMzFmNTA0NmIwNWMiLCJpYXQiOjE1MDA2MTgzNzI1NDV9.IKQiAfkYyhq40STUYiGDHkFs4zT_nfBW7LEvGyZQI6o

  (c)Check output - the authorization with the token is successful
  {
    "hi": "there"
  }

  */


  // Valid authentication data - Sign up first time
  app.post('/signup',Authentication.signup);
}
