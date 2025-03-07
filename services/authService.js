const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const authStatePath = path.join(__dirname, '../authState.json');

async function login(email, password) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // Verifica se o arquivo de estado de autenticação existe e está válido
  if (fs.existsSync(authStatePath)) {
    try {
      const authState = JSON.parse(fs.readFileSync(authStatePath, 'utf8'));
      if (authState.cookies && authState.localStorage) {
        console.log('Restaurando estado de autenticação...');
        await context.addCookies(authState.cookies);
        await context.addInitScript((storage) => {
          for (const [key, value] of Object.entries(storage)) {
            localStorage.setItem(key, value);
          }
        }, authState.localStorage);
      } else {
        console.log('Arquivo de autenticação inválido. Ignorando...');
      }
    } catch (error) {
      console.error('Erro ao ler o arquivo de autenticação:', error);
    }
  }

  const page = await context.newPage();
  await page.goto('https://www.facebook.com');

  // Verifica se já está logado
  const isLoggedIn = await page.evaluate(() => {
    return !!document.querySelector('input[name="email"]') === false;
  });

  if (!isLoggedIn) {
    console.log('Fazendo login no Facebook...');
    await page.fill('#email', email);
    await page.fill('#pass', password);
    await page.click('button[name="login"]');

    // Aguarda o login ser concluído
    await page.waitForSelector('.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6');

    // Coleta os cookies e o localStorage
    const cookies = await context.cookies();
    const localStorage = await page.evaluate(() => {
      return Object.assign({}, localStorage);
    });

    // Salva o estado de autenticação apenas se houver dados válidos
    if (cookies.length > 0 && Object.keys(localStorage).length > 0) {
      fs.writeFileSync(authStatePath, JSON.stringify({ cookies, localStorage }, null, 2));
      console.log('Estado de autenticação salvo com sucesso.');
    } else {
      console.log('Nenhum dado de autenticação válido para salvar.');
    }
  } else {
    console.log('Já está logado.');
  }

  await browser.close();
  return { message: 'Login successful' };
}

module.exports = { login };