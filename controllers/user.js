const User = require('../models/user');




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
        User.create({
          name: name,
          email: email,
          password: password
        })
        .then(result => {
          console.log('User created');
          res.status(201).json({ message: 'User created successfully', success: true });
        })
        .catch(err => {
          res.status(500).json({ message: err });
        });
      }
    })
})