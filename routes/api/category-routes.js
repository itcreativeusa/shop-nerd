// Initialize express router
const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", (req, res) => {
  // find all categories
  Category.findAll({
    // Include the Product model
    include: [{ model: Product, as: "products" }],
  }).then((categoryData) => {
    res.json(categoryData);
  });
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  Category.findByPk(req.params.id, {
    // Include the Product model
    include: [
      {
        model: Product,
        as: "products",
      },
    ],
  }).then((categoryData) => {
    res.json(categoryData);
  });
});
router.post("/", (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((category) => {
      //log a message created category
      res.json({ message: "Category created" });
    })
    .catch((err) => res.json(err));
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // log the result of the update operation
      res.json({ message: "Category updated" });
    })
    .catch((err) => res.json(err));
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  Category.destroy({ where: { id: req.params.id } })
    .then((category) => {
      // log the result of the delete operation
      res.json({ message: "Category deleted" });
    })
    .catch((err) => res.json(err));
});
// Module exports
module.exports = router;
