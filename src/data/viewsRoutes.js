import express from 'express';
import ProductManager from '../app/ProductManager.js';

const router = express.Router();


router.get('/', (req, res) => {
    let testUser = {
        name: "jose",
        last_name: "manuel"
    };
    res.render('index', testUser);
});

router.get('/chat', (req, res) => {
    res.render('chat', {});
});



const productManager = new ProductManager('data/products.json');
productManager.loadProducts();

// Ruta para obtener todos los productos con posible límite
router.get('/home', (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = productManager.getProducts(limit);
        res.render('home', { 
            products,
            role: true  // Establece el estatus como true
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


router.get('/realtimeproducts', (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = productManager.getProducts(limit);
        res.render('realtimeproducts', { 
            products,
            role: true  // Establece el estatus como true
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});











export default router;
