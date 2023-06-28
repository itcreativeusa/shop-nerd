// Initialize express router
const router = require("express").Router();
// Import the models to use its database functions.
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", (req, res) => {
  // find all products
  Product.findAll({
    // include its associated Category and Tag data
    include: [
      { model: Category, as: "category" },
      { model: Tag, as: "tags" },
    ],
  }).then((productData) => {
    res.json(productData);
  });
});

// get one product
router.get("/:id", (req, res) => {
  // find a single product by its `id`
  Product.findByPk(req.params.id, {
    // include its associated Category and Tag data
    include: [
      { model: Category, as: "category" },
      { model: Tag, as: "tags" },
    ],
  }).then((productData) => {
    res.json(productData);
  });
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 1,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (Array.isArray(req.body.tagIds) && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  let promise = Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  if (req.body.tagIds !== undefined) {
    promise = promise
      .then((product) => {
        // find all associated tags from ProductTag
        return ProductTag.findAll({ where: { product_id: req.params.id } });
      })
      .then((productTags) => {
        // get list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      });
  }
  promise
    .then((updatedProductTags) => res.json({ message: "Product updated" }))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});
router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  Product.destroy({ where: { id: req.params.id } })
    .then((productData) => {
      //log the result of the detete operation
      res.json({ message: "Product deleted" });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
