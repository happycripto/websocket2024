console.log('chat activo');

const socket = io();  // Inicializa una conexión WebSocket con el servidor

socket.emit('message', 'esto es data en forma de string');  // Envía un mensaje al servidor




