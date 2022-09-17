module.exports = {
  async up(queryInterface, Sequelize) {
    // in relationships, the commit process
    // adds the forieng key
    return queryInterface.addColumn(
      'users', // table's name that will receive the foreign key
      'avatar_id', // new column's name
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' }, // column 'id' from 'files' table
        onUpdate: 'CASCADE', // updates on 'users' table too when the avatar is updated in 'files' table
        onDelete: 'SET NULL', // sets NULL when the avatar is deleted in 'files' table
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    // for relationships, the rollback process deletes the foreign key
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
