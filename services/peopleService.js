const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const authStatePath = path.join(__dirname, '../authState.json');

/**
 * Extrai fotos de um perfil.
 * @param {Page} profilePage - Página do Playwright.
 * @param {string} profileUrl - URL do perfil.
 * @returns {Promise<Array<{name: string, parentesco: string}>>} - Lista de informações.
 */
async function extractPhotos(profilePage, profileUrl) {
  const urldirect4 = profileUrl.toString().includes('?id=')
    ? `${profileUrl}&sk=photos_by` : `${profileUrl}/photos_by`;
  await profilePage.goto(urldirect4);
  await profilePage.waitForSelector('body');

  let photos = [];
  try {
    var divPhotos = await profilePage.$$('.x78zum5.x1q0g3np.x1a02dak');

    if (divPhotos.length) {
      for (const pics of divPhotos) {

        const fotosuser = await pics.$$('.xzg4506.xycxndf.xua58t2.x4xrfw5.x1lq5wgf.xgqcy7u.x30kzoy.x9jhf4c.x9f619.x5yr21d.xl1xv1r.xh8yej3', 10000);

        if (fotosuser.length) {
          for (const photo of fotosuser) {
            photos.push(await photo.getAttribute('src'));
          }
        }
      }

    }
  } catch (error) {
    console.log('Erro ao buscar membros da família:', error);
  }

  return photos;
}

/**
 * Extrai informações básicas de um perfil.
 * @param {Page} profilePage - Página do Playwright.
 * @param {string} profileUrl - URL do perfil.
 * @returns {Promise<Array<{name: string, parentesco: string}>>} - Lista de informações.
 */
async function basicPerson(profilePage, profileUrl) {
  const urldirect3 = profileUrl.toString().includes('?id=')
    ? `${profileUrl}&sk=about`
    : `${profileUrl}/about`;

  await profilePage.goto(urldirect3);
  await profilePage.waitForSelector('body');

  let work = null, study = null, city = null, from = null, status = null, cell = null;
  const workSelectors = [
    'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u',
    'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xk50ysn.xi81zsa'
  ];

  for (const selector of workSelectors) {
    try {
      const elements = await profilePage.$$(selector);
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          const isTextNode = await elements[i].evaluate((el) => {
            return el.nodeType === Node.ELEMENT_NODE && el.textContent.trim() !== '';
          });

          if (isTextNode) {
            var text = await elements[i].textContent();
            text = text.toString().toLowerCase();

            if (text.includes('trabalho') || text.includes('trabalha') || text.includes('empresa') || text.includes('emprego')) {
              work = text;
            }
            if (text.includes('frequentou') || text.includes('frequenta') || text.includes('estudou') || text.includes('estuda')) {
              const studyElement = await elements[i].$('.xjp7ctv > span');
              if (studyElement) {
                study = await studyElement.textContent();
              } else {
                study = text;
              }
            }
            if (text.includes('mora em')) {
              const studyElement = await elements[i].$('.xjp7ctv > span');
              if (studyElement) {
                city = await studyElement.textContent();
              } else {
                city = text;
              }
            }
            if (text.includes('de')) {
              const studyElement = await elements[i].$('.xjp7ctv > span');
              if (studyElement) {
                from = await studyElement.textContent();
              } else {
                from = text;
              }
            }
            if (text.includes('solteira') || text.includes('solteiro') || text.includes('casada') || text.includes('casado') || text.includes('em um relacionamento')) {
              const studyElement = await elements[i].$('.xjp7ctv > span');
              if (studyElement) {
                status = await studyElement.textContent();
              } else {
                status = text;
              }
            }
            const phoneRegex = /\(\d{2}\)\s\d{4,5}-\d{4}/;
            if (phoneRegex.test(text)) {
              cell = text;
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      console.log(`Seletor ${selector} não encontrado.`);
    }
  }
  return { work, study, city, from, status, cell };
}

/**
 * Extrai informações sobre os familiares de um perfil.
 * @param {Page} profilePage - Página do Playwright.
 * @param {string} profileUrl - URL do perfil.
 * @returns {Promise<Array<{name: string, parentesco: string}>>} - Lista de familiares.
 */
async function familyPerson(profilePage, profileUrl) {
  const urldirect3 = profileUrl.toString().includes('?id=')
    ? `${profileUrl}&sk=about_family_and_relationships`
    : `${profileUrl}/about_family_and_relationships`;

  await profilePage.goto(urldirect3);
  await profilePage.waitForSelector('body'); // Aguarda o carregamento da página
  let family = [];

  try {
    // Seleciona os elementos que contêm os membros da família
    const familyMembers = await profilePage.$$('.x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.xexx8yu.xykv574.xbmpl8g.x4cne27.xifccgj.xs83m0k');

    if (familyMembers.length > 0) {
      // Itera sobre cada membro da família
      for (const member of familyMembers) {
        try {
          // Extrai o nome do familiar
          const nameElement = await member.$('.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u');
          const name = nameElement ? await nameElement.textContent() : null;
          const parentescoE = await member.$('.xi81zsa.x1nxh6w3.x1sibtaa');
          const parentesco = parentescoE ? await parentescoE.textContent() : null;

          // Adiciona o familiar ao array
          if (name && name !== 'Solteiro' && name !== 'Solteira' && !name.includes('Casado') && !name.includes('Casada')) {
            family.push({ name, parentesco });
          }
        } catch (error) {
          console.log('Erro ao extrair nome do familiar:', error);
        }
      }
    } else {
      console.log('Nenhum membro da família encontrado.');
    }
  } catch (error) {
    console.log('Erro ao buscar membros da família:', error);
  }

  return family;
}

/**
 * Extrai informações básicas de um perfil.
 * @param {Page} page - Página do Playwright.
 * @param {string} profileUrl - URL do perfil.
 * @returns {Promise<{genre: string, birthday: string, birthyear: string}>} - Informações básicas.
 */
async function extractPersonInfo(page, profileUrl) {
  try {
    const urldirect2 = profileUrl.toString().includes('?id=')
      ? `${profileUrl}&sk=about_contact_and_basic_info`
      : `${profileUrl}/about_contact_and_basic_info`;

    await page.goto(urldirect2);
    await page.waitForSelector('body');

    let genre = null, birthday = null, birthyear = null;

    // Seleciona os elementos que contêm as informações
    const elements = await page.$$('.xyamay9.xqmdsaz.x1gan7if.x1swvt13');
    if (elements.length > 0) {
      for (const element of elements) {
        const els = '.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.x1yc453h';
        const info = await element.$$(els);

        if (info) {

          for (let g = 0; g < info.length; g++) {
            const isTextNode = await info[g].evaluate((el) => {
              return el.nodeType === Node.ELEMENT_NODE && el.textContent.trim() !== '';
            });

            if (isTextNode) {
              const text = await info[g].textContent();

              if (text.includes('Gênero')) {
                const grender = await element.$$('.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h');
                genre = await grender[g]?.textContent();
              }

              if (text.includes('Data de nascimento')) {
                const grender = await element.$$('.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h');
                birthday = await grender[g]?.textContent();
              }

              if (text.includes('Ano de nascimento')) {
                const grender = await element.$$('.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h');
                birthyear = await grender[g]?.textContent();
              }
            }
          }
        }
      }
    }

    return { genre, birthday, birthyear };
  } catch (error) {
    console.error('Erro ao extrair informações básicas:', error);
    return null;
  }
}

/**
 * Obtém informações completas de um perfil.
 * @param {string} profile - URL do perfil.
 * @param {string} name - Nome do perfil.
 * @returns {Promise<{profilePic: string, basic: object, family: array}>} - Informações do perfil.
 */
async function getProfile(profile, name) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Carrega o estado de autenticação, se existir
    if (fs.existsSync(authStatePath)) {
      const authState = JSON.parse(fs.readFileSync(authStatePath, 'utf8'));
      await context.addCookies(authState.cookies);
      await context.addInitScript((storage) => {
        for (const [key, value] of Object.entries(storage)) {
          localStorage.setItem(key, value);
        }
      }, authState.localStorage);
    }

    await page.goto(profile);

    // Aguarda o elemento com o nome especificado
    await page.waitForSelector(`[aria-label*="${name}"]`, { timeout: 10000 });
    const elementContains = await page.$(`[aria-label*="${name}"]`);

    // Extrai a foto de perfil
    let profilePic = null;
    if (elementContains) {
      profilePic = await elementContains.evaluate((el) => {
        const imageElement = el.querySelector('image');
        return imageElement?.getAttribute('xlink:href');
      });
    }

    // Extrai informações básicas e familiares
    const basicInfo = await extractPersonInfo(page, profile);
    const familyInfo = await familyPerson(page, profile);
    const basic = await basicPerson(page, profile);
    const photos = await extractPhotos(page, profile);

    return { profilePic, basic: basicInfo, family: familyInfo, person: basic, photos: photos };
  } catch (error) {
    console.error('Erro ao extrair informações do perfil:', error);
    return null;
  } finally {
    await browser.close();
  }
}

/**
 * Busca pessoas no Facebook.
 * @param {number} maxResults - Número máximo de resultados.
 * @param {string} string - Termo de busca.
 * @returns {Promise<Array<{name: string, photo: string, href: string, username: string, info: string}>>} - Lista de pessoas.
 */
async function searchPeople(maxResults, string) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Carrega o estado de autenticação, se existir
    if (fs.existsSync(authStatePath)) {
      const authState = JSON.parse(fs.readFileSync(authStatePath, 'utf8'));
      await context.addCookies(authState.cookies);
      await context.addInitScript((storage) => {
        for (const [key, value] of Object.entries(storage)) {
          localStorage.setItem(key, value);
        }
      }, authState.localStorage);
    }

    // Navega até a página de busca
    await page.goto(
      `https://www.facebook.com/search/people/?q=${string}&sde=AbqYQQCuIq_5M5MKYA4Iw2z-7xyPApveqAXCe28_Flb57xRVS02IPjGGG4DWRathWwaD0uN042zmnORXBhq4wEPf`
    );

    // Verifica se a mensagem "Não encontramos nenhum resultado" está presente
    const noResults = await page.evaluate(() => {
      const noResultsMessage = document.querySelector('div.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6');
      return noResultsMessage && noResultsMessage.innerText.includes('Não encontramos nenhum resultado');
    });

    if (noResults) {
      return { message: 'Nenhum resultado encontrado.' };
    }

    // Função para rolar a página e carregar mais resultados
    const scrollAndLoad = async () => {
      let previousHeight;
      while (true) {
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(2000); // Aguarda o carregamento

        const newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === previousHeight) break;

        const currentResults = await page.$$eval('div[role="article"]', (items) => items.length);
        if (currentResults >= maxResults) break;
      }
    };

    await scrollAndLoad();

    // Coleta os resultados
    const people = await page.$$eval('div[role="article"]', (items, maxResults) => {
      return items.slice(0, maxResults).map((item) => {
        const name = item.querySelector('a[role="presentation"]')?.innerText;
        const href = item.querySelector('a[role="presentation"]')?.getAttribute('href');
        const login = href?.split('facebook.com/')[1];
        const username = login?.includes('profile.php?') ? login.split('profile.php?')[1] : login;
        const photo = item.querySelector('image')?.getAttribute('xlink:href');
        const info = item.querySelector('.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6')?.innerText;
        return { name, photo, href, username, info };
      });
    }, maxResults);

    return people;
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    return null;
  } finally {
    await browser.close();
  }
}

module.exports = { searchPeople, getProfile };