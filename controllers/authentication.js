const User=require('../models/user');// import custom file
//https://jwt.io/
const jwt=require('jwt-simple');//JSON Secret String library
const config=require('../config');// import custom file

function tokenForUser(user){

  // TIme before issuing the token
  const timestamp=new Date().getTime();
  // First param is the string we are going to encode. Second is the secret string from config.js file
  /* user.id is the id of the record entered for every user in mongoDB. So its the best string to be used to create the token as it never changes for that record. If you use email, it may be changed by user sometimes when being active.
    "_id" : ObjectId("5970f7a6399c8e06d8815884"),
    */
    // sub - standard 'subject' property to be used in jwt
    // iat- standard 'issued at time' property in jwt

  return jwt.encode({sub:user.id,iat:timestamp},config.secret);
}


exports.signup=function(req,res,next){
  // res.send({success:'true'});

  console.log("req.body",req.body);
  /* Send this POST request in body via Postman
  localhost:3090/signup
  {
  "email":"test@example.com",
  "password":"1234"
   }
   console output:
   req.body { email: 'test@example.com', password: '1234' }
   */

  const emailstr=req.body.email.toLowerCase();// To lower case since user can sometimes enter email id with uppercase
  const passwordstr=req.body.password;

  //Validate if any of the fields are not sent
  if(!emailstr || !passwordstr){
    return res.status(422).send({error:'Please provide email and password'});
  }

  // See if a user with the given email already exists (duplicate check)
  // Find the emailstr is existing in email(mongodb). If found, throw error 'err' and value of 'existingUser' will be returned with existing username
  User.findOne({email:emailstr},function(err,existingUser){
    // Search itself throws an error - something like connection to db failed
    if(err){return next(err);}

    console.log("existingUser:",existingUser);
    // If duplicate email exists, return Error
    if(existingUser){
      // .status is for setting http code for response
      // code 422 - unprocessed entity
      return res.status(422).send({error:'Email is in use'});
    }


  // If no duplicate email, create and save user record
  const user=new User({
    email:emailstr,
    password:passwordstr
  });



  //Save the record to the mongodb with callback function
  // If there is failure in save, then return err
  user.save(function(err){
    if(err){return next(err);}

    // respond to request indicating the user was created
    //res.json({user}); // used for testing in Postman

    // Testing done in Postman with response code
    // res.json({user});
    //POST: localhost:3090/signup
    /* Input in the body tab
    {
      "email":"testkishor@example.com",
      "password":"1234"
    }
    1. Below is the response for 'user'. Id is unique prop assigned for the record
    {
    "user": {
        "__v": 0,
        "email": "testkishor@example.com",
        "password": "1234",
        "_id": "5970eaf0089eb01e289a275b"
    }
    }

    2.If you send the post request again (to check for duplicate), below is the response
    {
    "error": "Email is in use"
    }

    */
    //res.json({"success":"true"}); // Return text


    res.json({token:tokenForUser(user)}); // Return the token created
    // Testing done in Postman with response code
    // res.json({token:tokenForUser(user)});
    //POST: localhost:3090/signup
     // input:{
      //  "email":"testktoeknr@example.com",
      //"password":"1234"
      //}
    /*
    {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTcxMDNjOWUzYzE1NTA0ZTA5ZjA2ZTAiLCJpYXQiOjE1MDA1Nzg3NjE3OTN9.tKTyzAo7QpWr7PFG77L1XLstatBCHHa0z-dTOOhrPEY"
    }  */
   });
 });
}

// For Sign In, after user present and password comparison to be valid, we have to generate token for the user
exports.signin=function(req,res,next){
  //User already have their email and password authenticated, we just need to give them token
  // req.user - contains user schema (email and password)
  //tokenForUser- function in this method to create a token
  res.send({token:tokenForUser(req.user)}); // return the token for the user
}
