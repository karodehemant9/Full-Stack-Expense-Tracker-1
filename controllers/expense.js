const Expense = require('../models/expense');
const User = require('../models/user');

exports.addExpense = (async (req, res, next) => {
  try {
    console.log('###############################');
    const amount = req.body.amount;
    console.log(amount);
    const description = req.body.description;
    console.log(description);
    const category = req.body.category;
    console.log(category);

    //Expense.create({amount: amount, description: description, category: category, userId: req.user.id}) == req.user.createExpense({amount: amount, description: description, category: category})
    const expense = await req.user.createExpense({
      amount: amount,
      description: description,
      category: category
    });

    const updatedUser = await User.update({ totalExpense: req.user.totalExpense + amount }, { where: { id: req.user.id } });
    console.log(updatedUser)
    console.log('Expense created----------------------------------');
    res.status(201).json({ expense: expense, message: 'Expense created successfully', success: true });
  } catch (error) {
    console.log(error);
  }
})


exports.getExpenses = ((req, res, next) => {
  //req.user.getExpenses() == Expense.findAll({where: {userId: req.user.id}})
  req.user.getExpenses()
    .then(expenses => {
      console.log(expenses);
      return res.status(200).json({ expenses: expenses, success: true });
      //res.json({expenses: expenses, success: true});
    })
    .catch(err => console.log(err));
})




exports.deleteExpense = ((req, res, next) => {
  const expenseId = req.params.expenseID;
  console.log('expense id to delete expense is: ')
  console.log(expenseId);
  Expense.destroy({ where: { id: expenseId, userId: req.user.id } })
    .then(noOfRecords => {
      console.log(noOfRecords);
      if (noOfRecords !== 0) {
        return res.status(200).json({ message: 'record deleted successfully', success: true });
      }
      return res.status(200).json({ message: 'expense doesn\'t belong to user', success: false });
    })
    .catch(err => {
      console.log(err);
    })
})
