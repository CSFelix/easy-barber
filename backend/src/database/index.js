/*
  This file is used to set all databases connections.

  Redis is treated in another file ('queue.js') due to
the queues be processed in another independent server instance.
*/

import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    // connection into PostGres
    this.connection = new Sequelize(databaseConfig);

    // provides the automatic connection, regardless which
    // model is trying to access
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    // connection into Mongo DB
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      // useFindAndModify: true // Starting with Mongoose version 6, you should not specify that as an option. It will be handled automatically.
    });
  }
}

export default new Database();
