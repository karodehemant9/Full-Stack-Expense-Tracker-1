const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const User = require('./models/user');
const expenseRoutes = require('./routes/expense');
const Expense = require('./models/expense');
const purchaseRoutes = require('./routes/purchase');
const Order = require('./models/order');
const premiumRoutes = require('./routes/premium');


const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
console.log('h11111');
app.use('/premium', premiumRoutes);


app.use('/', (req, res) =>{
    res.send('Home page');
});


User.hasMany(Expense);
Expense.belongsTo(User); 

User.hasMany(Order);
Order.belongsTo(User); 

sequelize
//.sync({force: true})
.sync()
.then(result =>{
})
.catch(err =>{
    console.log(err);
})

app.listen(8000);
