const User = require('../models/user');
const bcrypt = require('bcrypt');




function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  }
  else {
    return false;
  }
}


exports.addUser = ((req, res, next) => {
  const name = req.body.name;
  console.log(name);
  const email = req.body.email;
  console.log(email);
  const password = req.body.password;
  console.log(password);

  if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
    return res.status(400).json({ err: 'Bad Parameters. Something is missing' });
  }

  User.findAll({ where: { email: email } })
    .then(users => {
      console.log(users);
      console.log('I am in middle');
      console.log(users[0]);
      //if user with this email is found:
      // send a 200 response saying : res.status(200).send({message: 'User already exist', success: false});
      if (users.length > 0) {
         res.status(200).json({ message: 'Email already exist', success: false });
      }
      else {
        bcrypt.hash(password, 10, (err, hash)=>{
          User.create({
            name: name,
            email: email,
            password: hash
          })
          .then(result => {
            console.log('User created');
            res.status(201).json({ message: 'User created successfully', success: true });
          })
          .catch(err => {
            res.status(500).json({ message: err });
          });

        })
        
      }
    })
})


exports.validateUser = ((req, res, next) => {
  const email = req.body.email;
  console.log(email);
  const password = req.body.password;
  console.log(password);

  if(isStringInvalid(email) || isStringInvalid(password)){
    return res.status(400).json({message: 'Email or password is missing', success: false});
  }

  User.findAll({where: {email: email}})
  .then(users => {
    console.log(users);
    console.log(users[0]);
    //if user with this email is not found:
    // send a 404 response saying : res.status(404).send({message: 'User not found', success: false});
    //if found then check for the password
    if(users.length > 0){
        if(users[0].password === password){
          return res.status(200).json({message: 'User logged in successfully', success: true});
        }
        //if password is wrong:
        // send a response saying : res.send({message: 'password do not mmatch', success: false});
        else{
          return res.status(400).json({message: 'password do not match', success: false}); 
        }
    }
    else{
      return res.status(404).json({message: 'User not found', success: false});
    }
  })
  .catch(err => {
    return res.status(500).json({message: err, success: false});
  });
})