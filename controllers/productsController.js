const productService = require('../services/productService');

const productsController = {
  buscarProdutosDestaque: async (req, res) => {
    const { termo } = req.query;

    if (!termo) {
      return res.status(400).json({ error: 'O nome do produto é obrigatório' });
    }

    try {
      const produtos = await productService.buscarProdutosDestaque(termo);
      res.json(produtos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar produtos em destaque' });
    }
  },

  buscarProduto: async (req, res) => {
    const { produto, page } = req.query;

    if (!produto) {
      return res.status(400).json({ error: 'O nome do produto é obrigatório' });
    }

    try {
      const produtos = await productService.buscarProduto(produto, page);
      res.json(produtos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  },
};

module.exports = productsController;