const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const routes = require('./routes');
const sockets = require('./sockets/productsSockets');
const cors = require('cors');

const app = express();

// Middleware para processar JSON no corpo da requisição
app.use(express.json())

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.souwescley.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.souwescley.com/fullchain.pem'),
};;

// Configuração do CORS
app.use(cors({
  origin: 'https://souwescley.com:3000', // Permite apenas requisições do frontend
  methods: ['GET', 'POST'], // Métodos permitidos
  credentials: true, // Permite envio de cookies e cabeçalhos de autenticação
}));

const server = http.createServer(options, app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Configuração das rotas
app.use('/', routes);

// Configuração do Socket.IO
sockets(io);

// Inicia o servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});