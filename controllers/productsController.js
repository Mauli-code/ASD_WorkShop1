const productsService = require('../services/productsService');

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Product id must be a positive integer' });
    return undefined;
  }
  return id;
}

function validateProductData(req, res, requireAllFields) {
  const { name, price } = req.body;
  const hasRequiredFields = requireAllFields ? typeof name === 'string' && typeof price === 'number' : true;
  const hasValidProvidedFields = (name === undefined || typeof name === 'string') && (price === undefined || typeof price === 'number');

  if (!hasRequiredFields || !hasValidProvidedFields) {
    res.status(400).json({ error: 'Product requires a string name and numeric price' });
    return false;
  }

  return true;
}

async function getProducts(req, res, next) {
  try {
    const products = await productsService.getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  const id = parseId(req, res);
  if (id === undefined) return;

  try {
    const product = await productsService.getProductById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  if (!validateProductData(req, res, true)) return;

  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

async function putProduct(req, res, next) {
  await modifyProduct(req, res, next, productsService.replaceProduct, true);
}

async function patchProduct(req, res, next) {
  await modifyProduct(req, res, next, productsService.updateProduct, false);
}

async function modifyProduct(req, res, next, operation, requireAllFields) {
  const id = parseId(req, res);
  if (id === undefined || !validateProductData(req, res, requireAllFields)) return;

  try {
    const product = await operation(id, req.body);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  const id = parseId(req, res);
  if (id === undefined) return;

  try {
    const deleted = await productsService.deleteProduct(id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  putProduct,
  patchProduct,
  deleteProduct,
};