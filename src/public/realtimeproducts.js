document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    socket.on('productUpdated', (products) => {
        const productContainer = document.getElementById('productContainer');

        if (productContainer) {
            productContainer.innerHTML = ''; // Limpiar el contenedor

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.innerHTML = `
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>Precio: ${product.price}</p>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                `;
                productContainer.appendChild(productElement);
            });
        } else {
            console.error('No se encontró el contenedor de productos');
        }
    });

    function deleteProduct(id) {
        fetch('/api/products/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al eliminar el producto:', data.error);
            } else {
                console.log('Producto eliminado exitosamente');
            }
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
        });
    }
});
