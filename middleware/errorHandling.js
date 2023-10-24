const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

exports.errorHandle = ((err, req, res, next) => {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@###############################$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    
    const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });
    //{falgs: 'a'} = append data to existing file
    console.log(err.stack);
    errorLogStream.write(`${new Date().toISOString()}: ${err.stack}\n`);
    console.log('error log wrritten');
    next(err); // Pass the error to the default error handler
  });
