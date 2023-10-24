const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const nodemailer = require('nodemailer');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const User = require('./models/user');
const expenseRoutes = require('./routes/expense');
const Expense = require('./models/expense');
const purchaseRoutes = require('./routes/purchase');
const Order = require('./models/order');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
const errorHandlingMiddleware = require('./middleware/errorHandling');

const ForgetPasswordRequest = require('./models/forgetPasswordRequest');
const DownloadedFile = require('./models/downloadedFile');
const fileRoutes = require('./routes/file');


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { falgs: 'a' });
//{falgs: 'a'} = append data to existing file

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));


app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/file', fileRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);
app.use(errorHandlingMiddleware.errorHandle);






app.use('/', (req, res) => {
    res.send('Hello Home page');
});


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPasswordRequest);
ForgetPasswordRequest.belongsTo(User);


User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);

sequelize
    //.sync({force: true})
    .sync()
    .then(result => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    })


