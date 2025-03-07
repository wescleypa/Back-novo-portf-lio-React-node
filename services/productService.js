const axios = require('axios');
const { fetchProductDetails, fetchProductReviews } = require('../utils/fetchProductDetails');

const productService = {
  buscarProdutosDestaque: async (termo) => {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}`;
    const response = await axios.get(url);

    const produtosPromises = response.data.results.slice(0, 3).map(async (item) => {
      const details = await fetchProductDetails(item.id);

      return {
        id: item.id,
        titulo: item.title,
        originalPrice: item?.price,
        preco: Number(item?.price) > 1000 ? (Number(item.price) * 50) / 100 : ((Number(item?.price) * 80) / 100),
        link: item.permalink,
        imagem: (item.thumbnail?.length ? (item.thumbnail?.toString()?.includes("-I.jpg") ? item.thumbnail?.toString().replace("-I.jpg", "-O.jpg") : item?.thumbnail) : item?.thumbnail),
        condicao: item.condition,
        desc: details?.description ?? 'Sem descrição',
        rating: 4.5, // Placeholder
        cores: details?.cores,
        garantia: details?.garantia,
        seller_address: details?.seller_address,
        pictures: details?.pictures,
      };
    });

    return await Promise.all(produtosPromises);
  },

  buscarProduto: async (produto, page) => {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(produto)}&offset=${page}&limit=50`;
    const response = await axios.get(url);

    const produtosPromises = response.data.results.map(async (item) => {
      const details = await fetchProductDetails(item.id);

      return {
        id: item.id,
        titulo: item.title,
        originalPrice: item?.price,
        preco: Number(item?.price) > 1000 ? (Number(item.price) * 50) / 100 : ((Number(item?.price) * 80) / 100),
        link: item.permalink,
        imagem: (item.thumbnail?.length ? (item.thumbnail?.toString()?.includes("-I.jpg") ? item.thumbnail?.toString().replace("-I.jpg", "-O.jpg") : item?.thumbnail) : item?.thumbnail),
        condicao: item.condition,
        desc: details?.description ?? 'Sem descrição',
        rating: 4.5, // Placeholder
        cores: details?.cores,
        garantia: details?.garantia,
        seller_address: details?.seller_address,
        pictures: details?.pictures,
      };
    });

    const produtos = await Promise.all(produtosPromises);
    return { produtos, paging: response?.data?.paging };
  },
};

module.exports = productService;