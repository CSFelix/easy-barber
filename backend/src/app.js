/*
  This file is used to configure JSON as the body's default format,
show static images and files on browser, start the express server,
setting up the routes and so on.

  Oh, and we also import the '.env' file by importing the 'dotenv/config'
library. It allows us to use the env variables in the whole application.
*/

import 'dotenv/config';

import express from 'express';
import path from 'path';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // setting JSON as the body's default format
    this.server.use(express.json());

    // function to show images and static files
    // in the front-end
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
