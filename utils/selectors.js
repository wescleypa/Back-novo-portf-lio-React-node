async function waitForElementWithTimeout(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return await page.$$(selector);
  } catch (error) {
    console.log(`Elemento "${selector}" não encontrado após ${timeout}ms.`);
    return [];
  }
}

module.exports = { waitForElementWithTimeout };