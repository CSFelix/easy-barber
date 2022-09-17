import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        // these are all of the fields that the user
        // can set while Creating, Updating and Deleting
        // an Account
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL, // is not stored in the database, but it's returned when used get method
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          }, // how the file's url will be returned
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
