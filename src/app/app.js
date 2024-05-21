import express from 'express';
import path from 'path'; // Importa el módulo path
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import { __dirname } from '../utils/utils.js';
import createProductRoutes from '../data/productRoutes.js';  // Modificado
import cartRoutes from '../data/cartRoutes.js';
import viewsRouter from '../data/viewsRoutes.js';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

// Middleware para establecer el tipo MIME correcto para los archivos JavaScript
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});

// Log para verificar la solicitud de archivos estáticos
app.use((req, res, next) => {
    console.log(`Solicitud de archivo estático: ${req.url}`);
    next();
});

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars');

// Log para verificar rutas de vistas y archivos estáticos
console.log('Ruta de vistas:', path.join(__dirname, '../views'));

// Log para verificar solicitudes de archivos estáticos
app.use((req, res, next) => {
    console.log('Solicitud de archivo estático:', req.url);
    next();
});

app.use('/', viewsRouter);
app.use('/api/products', createProductRoutes(socketServer)); // Pasar socketServer al crear las rutas de productos
app.use('/api/carts', cartRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Configurar el servidor WebSocket
socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        console.log(data);
    });

    // Escuchar eventos de actualización de productos
    socket.on('productUpdated', (products) => {
        const productList = document.getElementById('productList');
        if (productList) {
            // Limpiar la lista antes de agregar los productos actualizados
            productList.innerHTML = '';

            // Agregar cada producto a la lista
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                    <p>ID del producto: ${product.id}</p>
                    <p>Nombre del producto: ${product.title}</p>
                    <p>Precio del producto: ${product.price ? product.price : 'Precio no disponible'}</p>
                `;
                productList.appendChild(productDiv);
            });
        }
    });
});
