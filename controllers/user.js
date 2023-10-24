const { UploadImageModel } = require('sib-api-v3-sdk');
const Expense = require('../models/expense');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const errorHandlingMiddleware = require('../middleware/errorHandling');





function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  }
  else {
    return false;
  }
}



const encryptionKey = '563a2395c4fc1a2089074b33d9ca255e309ca3ce73dcb2e8c9ac5c974b501ea8';
function generateAccessToken(id) {
  return jwt.sign({ userID: id }, encryptionKey)
}

exports.secretKey = encryptionKey;


exports.addUser = (async (req, res, next) => {
  const name = req.body.name;
  console.log(name);
  const email = req.body.email;
  console.log(email);
  const password = req.body.password;
  console.log(password);

  if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
    const customError = new Error('Bad Parameters. Something is missing'); // Create a custom error with a message
    next(customError);
    return res.status(400).json({ err: 'Bad Parameters. Something is missing' });
  }

  try {
    const users = await User.findAll({ where: { email: email } })
    console.log(users);
    console.log('I am in middle');
    console.log(users[0]);
    //if user with this email is found:
    // send a 200 response saying : res.status(200).send({message: 'User already exist', success: false});
    if (users.length > 0) {
      const customError = new Error('Email already exist'); // Create a custom error with a message
      next(customError);
      return res.status(200).json({ message: 'Email already exist', success: false });
    }
    else {
      bcrypt.hash(password, 10, async (err, hash) => {
        const t = await sequelize.transaction();
        try {
          const user = await User.create({
            name: name,
            email: email,
            password: hash
          }, {transaction: t})
          await t.commit();
          console.log('User created');
          return res.status(201).json({ message: 'User created successfully', success: true });
        }
        catch (err) {
          await t.rollback();
          return res.status(500).json({ message: err });
        };
      })
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
})


exports.validateUser = (async (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  const password = req.body.password;
  console.log(password);
  
  if (isStringInvalid(email) || isStringInvalid(password)) {
    const customError = new Error('Email or password is missing'); // Create a custom error with a message
    next(customError);
    return res.status(400).json({ message: 'Email or password is missing', success: false });
  }


  try {
    const users = await User.findAll({ where: { email: email } })

    console.log(users);
    console.log(users[0]);
    //if user with this email is not found:
    // send a 404 response saying : res.status(404).send({message: 'User not found', success: false});
    //if found then check for the password
    if (users.length > 0) {
      bcrypt.compare(password, users[0].password, (err, result) => {
        if (err) {
          next(err);
          return res.status(500).json({ message: 'Something went wrong', success: false });
        }
        if (result === true) {
          return res.status(200).json({ user: users[0], message: 'User logged in successfully', success: true, token: generateAccessToken(users[0].id) });
        }
        //if password is wrong:
        // send a response saying : res.send({message: 'password do not mmatch', success: false});
        else {
          const customError = new Error('password do not match'); // Create a custom error with a message
          next(customError);
          return res.status(400).json({ message: 'password do not match', success: false });
        }
      })
    }
    else {
      const customError = new Error('User not found'); // Create a custom error with a message
      next(customError);
      return res.status(404).json({ message: 'User not found', success: false });
      
    }
  } catch (error) {

    next(error);
    return res.status(500).json({ message: error, success: false });
  }

})




