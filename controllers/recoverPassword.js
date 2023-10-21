const nodemailer = require('nodemailer');

require('dotenv').config();






exports.resetPassword = (async (req, res, next) => {
  try {

    console.log(req.body.email);
    console.log('))))))))))))))))))))))))))))');
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'isobel.olson64@ethereal.email',
        pass: 'ESvzQfUaASmshxasEs'
      }
    });

    const info = await transporter.sendMail({
      from: '"Shubham Karode" <karode.shubham9@gmail.com>', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    return res.json({info: info, success: true});
  }
  catch (error) {
    console.log(error);
    res.json({info: info, success: false});
  }
})





