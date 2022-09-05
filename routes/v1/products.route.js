const express = require("express");
const { limiter } = require("../../controllers/middleware/limiter");
const viewCount = require("../../controllers/middleware/viewCount");
const productsController = require("../../controllers/products.controller");
const router = express.Router();

router
  .route("/:id")
  .get(productsController.getAllProducts)
  .post(productsController.insertProduct).patch(productsController.updateProduct).delete(productsController.deleteProduct);

  router.route("/:id").get(viewCount,limiter, productsController.getAllProducts)

module.exports = router;
