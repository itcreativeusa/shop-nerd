// index.js file to seed all data to the database
const seedCategories = require("./category-seeds");
const seedProducts = require("./product-seeds");
const seedTags = require("./tag-seeds");
const seedProductTags = require("./product-tag-seeds");

const sequelize = require("../config/connection");
// Function to seed all data to the database
const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log("\n----- DATABASE SYNCED -----\n");
  await seedCategories();
  console.log("\n----- CATEGORIES SEEDED -----\n");

  await seedProducts();
  console.log("\n----- PRODUCTS SEEDED -----\n");

  await seedTags();
  console.log("\n----- TAGS SEEDED -----\n");

  await seedProductTags();
  console.log("\n----- PRODUCT TAGS SEEDED -----\n");

  process.exit(0);
};

seedAll();
