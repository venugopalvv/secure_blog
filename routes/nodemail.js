var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bonyjohnomcr@gmail.com',
    pass: 'dtonaqcirzwlwquq'
  }
});

var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'bonytjohn@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

