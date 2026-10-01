const database = require('../database/productsDatabase');

async function getProducts() {
  return database.readProducts();
}

async function getProductById(id) {
  const products = await database.readProducts();
  return products.find((product) => product.id === id);
}

async function createProduct(productData) {
  const products = await database.readProducts();
  const nextId = products.reduce((highestId, product) => Math.max(highestId, product.id), 0) + 1;
  const product = { id: nextId, ...productData };
  await database.writeProducts([...products, product]);
  return product;
}

async function replaceProduct(id, productData) {
  const products = await database.readProducts();
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) return undefined;

  const product = { id, ...productData };
  products[productIndex] = product;
  await database.writeProducts(products);
  return product;
}

async function updateProduct(id, productData) {
  const products = await database.readProducts();
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) return undefined;

  const product = { ...products[productIndex], ...productData, id };
  products[productIndex] = product;
  await database.writeProducts(products);
  return product;
}

async function deleteProduct(id) {
  const products = await database.readProducts();
  const remainingProducts = products.filter((product) => product.id !== id);

  if (remainingProducts.length === products.length) return false;

  await database.writeProducts(remainingProducts);
  return true;
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};