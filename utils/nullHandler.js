function tratarValoresNulos(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      obj[key] = null;
    }
  }
  return obj;
}

module.exports = { tratarValoresNulos };