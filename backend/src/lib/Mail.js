/*
  This file is used to set the 'nodemailerhbs' and the
'express-handlebars' libraries, as well to create the session
to send the emails.
*/

import nodemailer from 'nodemailer';
import { resolve } from 'path';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

// 'express-handlebars' just works using the old import
const exphbs = require('express-handlebars');

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    // creating a session in the sender email
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {

    // path where all layouts are stored
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // setting the layouts and partials email's components
    // and the extension ('.hbs, .handlebars)
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    // Send emails by adding everything inside
    // the message and the Mail Config
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
