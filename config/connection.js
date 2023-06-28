require("dotenv").config();
// import the Sequelize constructor from the library
const Sequelize = require("sequelize");
// create connection to our database, pass in your MySQL information for username and password
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: "127.0.0.1",
        dialect: "mysql",
        dialectOptions: {
          decimalNumbers: true,
        },
      }
    );

module.exports = sequelize;
