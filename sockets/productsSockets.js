const productService = require('../services/productService');
const { fetchProductReviews } = require('../utils/fetchProductReviews');

/**
 * Gerencia os eventos de conexão do socket para busca de produtos e avaliações.
 * @param {import('socket.io').Server} io - Instância do servidor Socket.IO.
 */
module.exports = (io) => {
  const abortControllers = {};
  const pActual = {};

  io.on('connection', (socket) => {
    console.log('Um cliente se conectou:', socket.id);

    pActual[socket.id] = [];
    abortControllers[socket.id] = new AbortController();

    /**
     * Evento para buscar produtos em destaque.
     * @param {string} termo - Termo de busca.
     * @param {function} callback - Função de retorno com os produtos encontrados.
     */
    socket.on('buscar_produtos_destaque', async (termo, callback) => {
      if (!termo) {
        socket.emit('erro', 'O nome do produto é obrigatório');
        return;
      }

      if (pActual[socket.id].includes(termo)) return;
      pActual[socket.id].push(termo);

      try {
        const produtos = await productService.buscarProdutosDestaque(termo);
        callback(produtos);

        for (const produto of produtos) {
          if (abortControllers[socket.id].signal.aborted) {
            console.log('Busca de avaliações cancelada');
            break;
          }

          const reviews = await fetchProductReviews(produto.link, { signal: abortControllers[socket.id].signal });
          if (reviews) {
            socket.emit('avaliacoes_produto', { productId: produto.id, reviews });
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          socket.emit('erro', 'Erro ao buscar produtos');
        }
      }
    });

    /**
     * Evento para buscar produtos paginados.
     * @param {string} termo - Termo de busca.
     * @param {number} page - Página atual.
     * @param {function} callback - Função de retorno com os produtos encontrados.
     */
    socket.on('buscar_produto', async (termo, page, callback) => {
      if (!termo) {
        socket.emit('erro', 'O nome do produto é obrigatório');
        return;
      }

      if (abortControllers[socket.id]) {
        abortControllers[socket.id].abort();
        delete abortControllers[socket.id];
      }

      const controller = new AbortController();
      abortControllers[socket.id] = controller;

      try {
        const produtos = await productService.buscarProduto(termo, page);
        callback(produtos);

        for (const produto of produtos?.produtos) {
          if (controller.signal.aborted) {
            console.log(`Busca de avaliações cancelada para o produto ${produto.id}`);
            break;
          }

          const reviews = await fetchProductReviews(produto.link, { signal: controller.signal });
          if (reviews) {
            socket.emit('avaliacoes_produto', { productId: produto.id, reviews });
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          socket.emit('erro', 'Erro ao buscar produtos');
        }
      }
    });

    /**
     * Evento disparado ao desconectar.
     */
    socket.on('disconnect', () => {
      pActual[socket.id] = null;
      delete pActual[socket.id];

      console.log('Um cliente se desconectou:', socket.id);

      if (abortControllers[socket.id]) {
        abortControllers[socket.id].abort();
        delete abortControllers[socket.id];
      }
    });
  });
};
