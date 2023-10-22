const express = require('express');
const expenseController = require('../controllers/expense');
const authenticateUser = require('../middleware/auth');
const router = express.Router();


router.post('/add-expense', authenticateUser, expenseController.addExpense);

router.get('/get-expenses/:pageNo', authenticateUser, expenseController.getExpenses);

router.delete('/delete-expense/:expenseID', authenticateUser, expenseController.deleteExpense);

router.get('/download', authenticateUser, expenseController.downloadExpenses);

router.get('/get-downloadable-expense-files', authenticateUser, expenseController.getDownloadableExpenseFiles);





module.exports = router;
