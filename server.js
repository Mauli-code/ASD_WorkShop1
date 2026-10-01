 const express = require('express');
const productRoutes = require('./routes/productRoutes');
const { cacheMiddleware, invalidateCacheOnMutation } = require('./middleware/cache');

const app = express();

app.use(express.json());
app.use(cacheMiddleware);
app.use(invalidateCacheOnMutation);
app.use('/products', productRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});