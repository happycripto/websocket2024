import express from 'express';
import fs from 'fs';

// Función para generar un ID único para el carrito
function generateUniqueCartId() {
  // Implementa la lógica para generar un ID único, por ejemplo, utilizando un timestamp
    return Date.now().toString();
}

// Función para guardar el carrito en "cart.json"
function saveCartToFile(cart) {
  // const cartsData = loadCartsFromFile();
  // cartsData.push(cart);
  fs.writeFileSync('data/cart.json', JSON.stringify(cart, null, 2), 'utf-8');
}

// Para leer json de productos
function loadProductsFromFile() {
  try {
    const data = fs.readFileSync('data/products.json', 'utf-8');
    return JSON.parse(data);
    
  } catch (error) {
    return [];
  }
}


// Función para cargar los carritos desde el archivo "cart.json"
function loadCartsFromFile() {
  try {
    const data = fs.readFileSync('data/cart.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

const router = express.Router();

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
  try {
      const newCart = req.body;
      const cartId = generateUniqueCartId();
      newCart.id = cartId;
      newCart.products = [];
      const carts = loadCartsFromFile();
      carts.push(newCart);
      saveCartToFile(carts);
      res.json({ message: 'Carrito creado exitosamente', id: cartId });
  } catch (error) {
      res.status(500).json({ error: 'Error al crear el carrito' });
  }
});


// Ruta para obtener un carrito por su ID
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const carts = loadCartsFromFile();
  const cart = carts.flat().find((cart) => cart.id === cartId);
  if (cart) {
      res.json(cart);
  } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId =req.params.pid; // Convertir a número
  const quantity = req.body.quantity || 1; // Default a 1 si no se especifica
  const carts = loadCartsFromFile();

  const cart = carts.findIndex(cart => cart.id === cartId);
  if (cart === -1) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
  }

//   if (!cart.products) {
//     cart.products = [];
// }
// console.log('cart.products length:', cart.products.length);


  const existingProductIndex = carts[cart].products.findIndex((product) => product.id ===productId);

  if (existingProductIndex !== -1) {
      // Si el producto existe en el carrito, actualizar la cantidad
      carts[cart].products[existingProductIndex].quantity += quantity;
  } else {
      // Si el producto no existe en el carrito, agregarlo con la cantidad especificada
      carts[cart].products.push({ id: productId, quantity });
  }

  saveCartToFile(carts);
  res.json({ message: 'Producto agregado al carrito exitosamente' });
});


export default router;
