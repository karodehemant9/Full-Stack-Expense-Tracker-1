const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');



exports.getLeaderboardData = (async (req, res, next) => {
  
const result = await sequelize.query('SELECT sum(e.amount) as totalExpense, u.id, u.name from users as u INNER JOIN expenses as e ON u.id = e.userId GROUP BY e.userId ORDER BY sum(e.amount) DESC');

console.log(result);
return res.json({leaderboardData: result[0], success: true});
})
