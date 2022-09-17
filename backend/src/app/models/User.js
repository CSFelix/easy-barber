import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // these are all of the fields that the user
        // can set while Creating, Updating and Deleting
        // an Account
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // these field doesn't exist in the database
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Hooks >> pieces of code that are executed before or after
    // some processes automatically
    this.addHook('beforeSave', async (user) => {
      // generates a hash just when the user is informing
      // a new password
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // associates File Model with User Model
  // in order to update the avatar into 'users' table
  static associate(models) {
    // tells that the id from 'files' table
    // will be passed to 'avatar_id' column
    // from 'users' table
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
