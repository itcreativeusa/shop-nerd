const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll().then((categoryData) => {
    res.json(categoryData);
  });
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findByPk(req.params.id).then((categoryData) => {
    res.json(categoryData);
  });
});

router.post("/", (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((category) => {
      // if there are category tags, create pairings to bulk create in the CategoryTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const categoryTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            category_id: category.id,
            tag_id,
          };
        });
        return CategoryTag.bulkCreate(categoryTagIdArr);
      }
      // if no category tags, just respond
      res.status(200).json(category);
    })
    .then((categoryTagIds) => {
      // if categoryTagIds are created, respond with them
      if (categoryTagIds) {
        res.status(200).json(categoryTagIds);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value

  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // find all associated tags from ProductTag
      return categoryTagIds.findAll({ where: { product_id: req.params.id } });
    })
    .then((CategoryTag) => {
      // get list of current tag_ids
      const categoryTagIds = CategoryTag.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newCategoryTags = req.body.tagIds
        .filter((tag_id) => !categoryTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            category_id: category.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const categoryTagsToRemove = CategoryTag.filter(
        ({ tag_id }) => !req.body.tagIds.includes(tag_id)
      ).map(({ id }) => id);

      // run both actions
      return Promise.all([
        CategoryTag.destroy({ where: { id: categoryTagsToRemove } }),
        CategoryTag.bulkCreate(newCategoryTags),
      ]);
    })
    .then((updatedCategoryTags) => res.json({ message: "Category updated" }))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  Category.destroy({ where: { id: req.params.id } })
    .then((category) => {
      res.json({ message: "Category deleted" });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
