const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');



exports.addExpense = (async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
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
    }, { transaction: t });

    const updatedUser = await User.update({ totalExpense: Number(req.user.totalExpense) + Number(amount) }, { where: { id: req.user.id }, transaction: t });
    await t.commit();
    res.status(201).json({ expense: expense, message: 'Expense created successfully', success: true });
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
})


exports.getExpenses = (async (req, res, next) => {
  //req.user.getExpenses() == Expense.findAll({where: {userId: req.user.id}})
  try {
    const expenses = await req.user.getExpenses()
    console.log(expenses);
    return res.status(200).json({ expenses: expenses, success: true });
    //res.json({expenses: expenses, success: true});
  }
  catch(err) {
    console.log(err);
  }
})




exports.deleteExpense = (async (req, res, next) => {
  const t = await sequelize.transaction();
  const expenseId = req.params.expenseID;
  console.log('expense id to delete expense is: ')
  console.log(expenseId);
  try {
    const expenseToDelete  = await Expense.findAll({ where: { id: expenseId, userId: req.user.id }})
    const amount = expenseToDelete[0].amount;

    const updatedUser = await User.update({ totalExpense: Number(req.user.totalExpense) - Number(amount) }, { where: { id: req.user.id }, transaction: t });
    
    let noOfRecords = await Expense.destroy({ where: { id: expenseId, userId: req.user.id }, transaction: t })
    console.log(noOfRecords);
    
    if (noOfRecords !== 0) {
      await t.commit();
      return res.status(200).json({ message: 'record deleted successfully', success: true });
    }
    await t.rollback();
    return res.status(200).json({ message: 'expense doesn\'t belong to user', success: false });
  }
  catch (err) {
    await t.rollback();
    console.log(err);
  }
})
