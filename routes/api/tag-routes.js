const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    // Include the associated Product data with the alias "products"
    include: [
      {
        model: Product,
        through: ProductTag,
        foreignKey: "tag_id",
      },
    ],
  }).then((tag) => {
    res.json(tag);
  });
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findByPk(req.params.id, {
    // Include the associated Product data with the alias "products"
    include: [
      {
        model: Product,
        through: ProductTag,
        foreignKey: "tag_id",
      },
    ],
  }).then((tag) => {
    res.json(tag);
  });
});

router.post("/", (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((tag) => {
      res.json({ message: "Tag created" });
    })
    .catch((err) => res.json(err));
});

router.put("/:id", (req, res) => {
  // update a ag by its `id` value
  Tag.update(req.body, { where: { id: req.params.id } })
    .then((tagData) => {
      console.log(tagData); // Log the result of the update operation
      res.json({ message: "Tag updated" });
    })
    .catch((err) => res.json(err));
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  }).then((tag) => {
    res.json({ message: "Tag deleted" });
  });
});

module.exports = router;
