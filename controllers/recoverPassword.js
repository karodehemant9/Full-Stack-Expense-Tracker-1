const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const ForgetPasswordRequest = require('../models/forgetPasswordRequest');
const errorHandlingMiddleware = require('../middleware/errorHandling');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../util/database');
const bcrypt = require('bcrypt');
require('dotenv').config();

const neededPath = path.join(__dirname, '..', '/views', 'recoverpassword.html');
console.log(neededPath);




exports.forgotPassword = (async (req, res, next) => {
  let info;
  const t = await sequelize.transaction();
  try {
    const email = req.body.email;
    const users = await User.findAll({ where: { email: email } })
    console.log(users[0]);
    if (users[0] === undefined) {
      return res.json({ information: info, success: false, message: 'Incorrect Email ID' });
    }

    const uuid = uuidv4();
    const userId = users[0].id;
    const isActive = true;

    const forgetPasswordRequest = await ForgetPasswordRequest.create({
      uuid: uuid,
      userId: userId,
      isActive: isActive
    }, { transaction: t });

    await t.commit();

    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.SMTP_ETHEREAL_USERNAME,
        pass: process.env.SMTP_ETHEREAL_PASSWORD
      }
    });

    info = await transporter.sendMail({
      from: '"Shubham Karode" <karode.shubham9@gmail.com>', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: '<p>Click <a href = "http://localhost:8000/password/resetpassword/' + uuid + '">here</a> to reset your password</p>'
    });

    console.log("Message sent: %s", info.messageId);

    return res.json({ information: info, success: true });
  }
  catch (error) {
    await t.rollback();
    console.log(error);
    next(error);
    return res.json({ information: info, success: false });
  }
})



exports.resetPassword = (async (req, res, next) => {
  try {
    const uuid = req.params.uuid;
    const forgetPasswordRequests = await ForgetPasswordRequest.findAll({ where: { uuid: uuid } })
    const forgetPasswordRequest = forgetPasswordRequests[0];
    if (forgetPasswordRequest.isActive === false) {
      return res.json({ forgetPasswordRequest: forgetPasswordRequest, success: false });
    }
    res.sendFile(neededPath);
    //return res.json({ forgetPasswordRequest: forgetPasswordRequest, success: true });
  }
  catch (error) {
    console.log(error);
    next(error);
    return res.json({ error: error, success: false });
  }
})




exports.updatePassword = (async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log('#########################');
    const email = req.body.email;
    console.log(email);

    const users = await User.findAll({ where: { email: email } })
    console.log(users[0]);

    if (users.length > 0) {
      console.log('I if block');
      
      const userId = users[0].id;
      const password = req.body.password;
      console.log(password);

      const forgetPasswordRequests = await ForgetPasswordRequest.findAll({ where: { userId: userId } })
      const forgetPasswordRequest = forgetPasswordRequests[0];
      forgetPasswordRequest.isActive = false;
      await forgetPasswordRequest.save();


      bcrypt.hash(password, 10, async (err, hash) => {
        const t = await sequelize.transaction();
        try {
          const user = await User.update({
            password: hash
          }, { where: { email: email }, transaction: t })
          console.log('User password update');
          await t.commit();
          res.status(201).json({ message: 'User updated successfully', success: true });
        }
        catch (err) {
          await t.rollback();
          errorHandlingMiddleware.errorHandle(err, req, res, next);
          return res.status(500).json({ message: err });
        };
      })
    }
    else {
      const customError = new Error('Email not found'); // Create a custom error with a message
      next(customError);
      return res.status(200).json({ message: 'Email not found', success: false });
    }

  } catch (error) {
    await t.rollback();
    console.log(error);
    next(error);
    return res.json({ error: error, success: false });
  }
})



