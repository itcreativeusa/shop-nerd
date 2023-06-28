const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");

class ProductTag extends Model {}

//Model for ProductTag
ProductTag.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: { model: "product", key: "id", unique: false },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: { model: "tag", key: "id", unique: false },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "product_tag",
  }
);
// Module exports
module.exports = ProductTag;
