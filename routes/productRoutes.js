const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.putProduct);
router.patch('/:id', productsController.patchProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;