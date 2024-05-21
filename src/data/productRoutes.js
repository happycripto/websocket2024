import express from 'express';
import ProductManager from '../app/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('data/products.json');
productManager.loadProducts();

export default function createProductRoutes(socketServer) { // Función que acepta socketServer

    // Ruta para obtener todos los productos con posible límite
    router.get('/', (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const products = productManager.getProducts(limit);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    });

    // Ruta para obtener un producto por su ID
    router.get('/:pid', (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            const product = productManager.getProductByID(productId);
            socketServer.emit('productUpdated', productManager.getProducts());
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    });

    // Ruta para agregar un nuevo producto
    router.post('/', (req, res) => {
        try {
            const newProduct = req.body;
            console.log(newProduct);
            productManager.addProduct(newProduct);
            socketServer.emit('productUpdated', productManager.getProducts());
            res.json({ message: 'Producto agregado exitosamente' });
        } catch (error) {
            if (error.message === 'El código del producto ya existe') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error al agregar el producto' });
            }
        }
    });


    // Ruta para actualizar un producto por su ID
    router.put('/:pid', (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            const updatedFields = req.body;
            productManager.updateProduct(productId, updatedFields);
            res.json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    });

    // Ruta para eliminar un producto por su ID
    router.delete('/:pid', (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            productManager.deleteProduct(productId);
            socketServer.emit('productUpdated', productManager.getProducts());
            res.json({ message: 'Producto eliminado exitosamente delete' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    });

    return router;
}
