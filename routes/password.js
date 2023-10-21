const express = require('express');
const recoverPasswordController = require('../controllers/recoverPassword');
const router = express.Router();

router.post('/forgetpassword', recoverPasswordController.forgotPassword);

router.get('/resetpassword/:uuid', recoverPasswordController.resetPassword);

router.post('/updatepassword', recoverPasswordController.updatePassword);

module.exports = router;
