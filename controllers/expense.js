const Expense = require('../models/expense');
const DownloadedFile = require('../models/downloadedFile');
const User = require('../models/user');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');



exports.addExpense = (async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
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
  catch (err) {
    console.log(err);
  }
})




exports.deleteExpense = (async (req, res, next) => {
  const t = await sequelize.transaction();
  const expenseId = req.params.expenseID;
  console.log('expense id to delete expense is: ')
  console.log(expenseId);
  try {
    const expenseToDelete = await Expense.findAll({ where: { id: expenseId, userId: req.user.id } })
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


exports.downloadExpenses = (async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    

    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;

    const filename = `Expense${userId}/${new Date()}.txt`;
    //the file name should depend upon userId
    //every time we download a file a new file should be uploaded to S3(based on date)

    const uploadedFileURL = await uploadToS3(stringifiedExpenses, filename);

    const downloadedFile = await req.user.createDownloadedFile({
      fileURL : uploadedFileURL
    });

    return res.status(200).json({ fileURL: uploadedFileURL, success: true });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({fileURL: '', success: false, err: err});
  }

})



function uploadToS3(data, filename) {
  return new Promise((resolve, reject) => {
    const BUCKET_NAME = 'expense-tracker123';
    const IAM_USER_KEY = 'AKIA45SJUWEXRZIAZ44Q';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    })


    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read' //making your files publically visible
    }

    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        reject(err);
      }
      else {
        console.log(s3response);
        console.log('@#@#@#@#@#@#@#@#@#');
        console.log(s3response.Location);
        resolve(s3response.Location);
      }
    })
  });
}



exports.getDownloadableExpenseFiles = (async (req, res, next) => {
  //req.user.getExpenses() == Expense.findAll({where: {userId: req.user.id}})
  try {
    console.log('############$#$#$#$#$#$###############')
    const files = await req.user.getDownloadedFiles();
    console.log(files);
    return res.status(200).json({ files: files, success: true });
    //res.json({expenses: expenses, success: true});
  }
  catch (err) {
    console.log(err);
  }
})
