async function fetchProductDetails(productId) {
  try {
    const descriptionResponse = await fetch(`https://api.mercadolibre.com/items/${productId}/description`);
    const descriptionData = await descriptionResponse.json();
    if (descriptionData?.plain_text) {
      descriptionData.plain_text = descriptionData?.plain_text.includes("\n") ? descriptionData?.plain_text.split("\n") : descriptionData?.plain_text;
    }

    const item = await fetch(`https://api.mercadolibre.com/items/${productId}`);
    const itemData = await item.json();

    const cores = [];
    const cor = itemData.attributes.find(attr => attr.id === 'COLOR')?.value_name || null;
    const corPrincipal = itemData.attributes.find(attr => attr.id === 'MAIN_COLOR')?.value_name || null;
    const colors = itemData.variations && itemData.variations.length > 0 ? (itemData.variations[0].attribute_combinations.find(attr => attr.id === 'COLOR')?.values || 'Não informado') : null;

    if (cor) cores.push(cor);
    else if (corPrincipal) cores.push(corPrincipal);
    else if (colors) cores.push(colors);

    const garantia = {
      tipo: itemData.sale_terms.find(term => term.id === 'WARRANTY_TYPE')?.value_name || 'Não especificado',
      tempo: itemData.sale_terms.find(term => term.id === 'WARRANTY_TIME')?.value_name || 'Não especificado'
    };

    return {
      description: descriptionData.plain_text ?? 'Sem descrição',
      pictures: itemData?.pictures ?? [],
      seller_address: itemData?.seller_address ?? {},
      cores, garantia
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do produto:', error);
    return null;
  }
}

module.exports = { fetchProductDetails };