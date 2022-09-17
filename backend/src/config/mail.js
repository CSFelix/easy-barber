/*
  Mail Configurations, like host, port, user, password and
SSL/TSL options.

  For Development Environment, is recomended to use MailTrap (free),
and for Production Environment, Amazon SES (paid)
*/

export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // uses ssl, tsl
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Easy Barber Team <noreply@easybarber.com>',
  },
};
