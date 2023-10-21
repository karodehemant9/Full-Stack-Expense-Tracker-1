const express = require('express');
const recoverPasswordController = require('../controllers/recoverPassword');
const router = express.Router();

router.post('/forgetpassword', recoverPasswordController.resetPassword);

module.exports = router;
