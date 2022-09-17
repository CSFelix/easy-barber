/*
  All migration files are used to create tables and relationships
betweeen them.

  And yes, different to the way I'm used to do with Java, where I
do all DDL process directly into the DBMGS, in Node we usually do
with JavaScript and migrations.
*/

module.exports = {
  up(queryInterface, Sequelize) {
    // the commit process creates the table with
    // the specificied columns
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      provider: {
        // true >> barber (provides service)
        // false >> client (uses the service)
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    // the rollback process just drops the table
    // with all the rows
    return queryInterface.dropTable('users');
  },
};
