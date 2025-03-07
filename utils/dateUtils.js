function converterDataParaMySQL(dataString) {
  const meses = {
    janeiro: 1,
    fevereiro: 2,
    março: 3,
    abril: 4,
    maio: 5,
    junho: 6,
    julho: 7,
    agosto: 8,
    setembro: 9,
    outubro: 10,
    novembro: 11,
    dezembro: 12,
  };

  const partes = dataString.split(' de ');
  if (partes.length !== 3) {
    throw new Error('Formato de data inválido. Use "dia de mês de ano".');
  }

  const dia = parseInt(partes[0], 10);
  const mes = meses[partes[1].toLowerCase()];
  const ano = parseInt(partes[2], 10);

  if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
    throw new Error('Data inválida. Verifique o formato.');
  }

  const dataFormatada = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  return dataFormatada;
}

module.exports = { converterDataParaMySQL };