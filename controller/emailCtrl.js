const nodemailer=require('nodemailer');


// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS
//       }
//   });

//   const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: options.to,
//       subject: options.subject,
//       html: options.html
//   };

//   await transporter.sendMail(mailOptions);
// };


const sendEmail = async (data) => {
    console.log("Sending email to:", data.to);
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP,
      },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
      from: '"Hey👻" <${process.env.MAIL_ID}>', // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
      html: data.html, // html body
  });

  console.log('Message sent: %s', info.messageId);
}





module.exports=sendEmail;