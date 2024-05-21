import fs from 'fs';

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.productIdCounter = 1; // Para asignar un ID autoincrementable
        this.path = filePath;
        this.path = 'src/data/products.json';
    }

    loadProducts() {
        try {
            console.log('Ruta del archivo products.json:', this.path);
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.productIdCounter = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
        } catch (error) {
            this.products = [];
            this.productIdCounter = 1;
    
            // Crear el archivo 
            this.saveProducts();
        }
    }
    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }


    addProduct(product) {
        if (this.products.some((p) => p.code === product.code)) {
            console.error('El código del producto ya existe');
            return;
        }

        if (!product.title || !product.price) {
            console.error('Todos los campos son obligatorios');
            return;
        }
        
        const newProduct = {
            ...product,
            id: this.productIdCounter,
            status: true, // Agregamos el campo status con valor true por defecto
        };
        
        this.products.push(newProduct);
        this.productIdCounter++;
        this.saveProducts();
    }
    
    getProducts() {
        return this.products;
    }
    
    getProductByID(id) {
        const product = this.products.find((p) => p.id === id);
            if (!product) {
                console.error('Producto no encontrado');
                return;
            }
            
        return product;
    }
    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.error('Producto no encontrado');
            return;
        }
        const updatedProduct = {
            ...this.products[productIndex],
            ...updatedFields,
            id: this.products[productIndex].id, // No debe cambiarse el ID
            
        };
        this.products[productIndex] = updatedProduct;
        this.saveProducts();
    }
    deleteProduct(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.error('Producto no encontrado');
            return;
        }
        this.products.splice(productIndex, 1);
        this.saveProducts();
    }
}
    
// Ejemplo de uso con la nueva clase
const productManager = new ProductManager('data.json');
productManager.loadProducts();
    
// Agregar productos
productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    thumbnail: 'url_del_thumbnail_1',
    code: 'codigo_1',
    stock: 10,
});

productManager.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 200,
    thumbnail: 'url_del_thumbnail_2',
    code: 'codigo_2',
    stock: 5,
});
// Prueba de Producto Repetido
productManager.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 200,
    thumbnail: 'url_del_thumbnail_2',
    code: 'codigo_2',
    stock: 5,
});

// Obtener todos los productos
const allProducts = productManager.getProducts();

// Obtener producto por ID
// const productId = 1;
// const productById = productManager.getProductByID(productId);
// console.log(productById);

// Actualizar producto por ID
const productIdToUpdate = 1;
const updatedFields = {
    title: 'Nuevo título coder',
    description: 'Nueva descripción',
    price: 300,
    thumbnail: 'nueva_url_del_thumbnail',
    code: 'nuevo_codigo',
    stock: 15,
};
productManager.updateProduct(productIdToUpdate, updatedFields);

// Eliminar producto por ID
const productIdToDelete = 1;
productManager.deleteProduct(productIdToDelete);

// Para correr codigo en node (node ProductManager.js)
export default ProductManager;
