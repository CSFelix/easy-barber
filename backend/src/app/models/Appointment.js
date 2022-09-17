/*
  Each model corresponds to a table into a SQL Database.

  PS.: Models are like DAO Classes' Attributes in Java.
*/

import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        // each column that the table will have
        //
        // PS.: all 'VIRTUAL' types are columns that doesn't
        // exist into the tables, but they're used in the application's
        // processes.
        date: Sequelize.DATE,
        cancelled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancellable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        // the second parameeter always will be 'sequelize', in other
        // to use the library to access the database and to manipulate
        // the datas sent
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // when a model has more than one relationship
    // with a same model, we gotta set an alias to
    // each relationshiop. It's needed in other to
    // Sequelize doesn't return an error
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
