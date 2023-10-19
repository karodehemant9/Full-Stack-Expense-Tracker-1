const Expense = require('../models/expense');

exports.addExpense = ((req, res, next) => {
  const amount = req.body.amount;
  console.log(amount);
  const description = req.body.description;
  console.log(description);
  const category = req.body.category;
  console.log(category);

  Expense.create({
    amount: amount,
    description: description,
    category: category
  })
  .then(expense => {
    console.log('Expense created');
    res.status(201).json({ expense: expense, message: 'Expense created successfully', success: true });
  })
  .catch(err => {
    console.log(err);
  }); 
})


exports.getExpenses = ((req, res, next) => {
  //req.user.getExpenses() == Expense.findAll({where: {userId: req.user.id}})
  Expense.findAll()
  .then(expenses => {
    console.log(expenses);
    return res.status(200).json({expenses: expenses, success: true});
    //res.json({expenses: expenses, success: true});
  })
  .catch(err => console.log(err));
})




exports.deleteExpense = ((req, res, next) => {
  const expenseId = req.params.expenseID;
  console.log('expense id to delete expense is: ')
  console.log(expenseId);
  Expense.destroy({ where: { id: expenseId} })
  .then(noOfRecords => {
    console.log(noOfRecords);
    if(noOfRecords !== 0){
      return res.json('record deleted successfully');
    }  
  })
  .catch(err => console.log(err));
  
})
