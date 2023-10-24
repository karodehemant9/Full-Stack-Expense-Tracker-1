const express = require('express');
const fileController = require('../controllers/file');
const authenticateUser = require('../middleware/auth');
const router = express.Router();




router.delete('/delete-file/:fileID', authenticateUser, fileController.deleteExpenseFile);


router.get('/get-downloadable-expense-files', authenticateUser, fileController.getDownloadableExpenseFiles);



module.exports = router;
