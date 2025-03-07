const { chromium } = require('playwright');

async function fetchProductReviews(productLink) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(productLink);

    const hasReviews = await page.$('#reviews_capability_v3 > div > section > div > div:nth-child(1) > div:nth-child(1) > div.ui-review-capability__rating');
    if (hasReviews) {
      await page.waitForSelector('#reviews_capability_v3 > div > section > div > div:nth-child(1) > div:nth-child(1) > div.ui-review-capability__rating > div:nth-child(1) > p');

      const reviews_detail = await page.$$eval(
        '#reviews_capability_v3 > div > section > div > div:nth-child(2) > div.ui-review-capability-filter > div.ui-review-capability-filter__comments > div.ui-review-capability-comments',
        (elements) => {
          return elements.map((element) => {
            const divSelector = element.querySelectorAll('div > article');
            const reviews = [];

            divSelector.forEach((d) => {
              const comment = d.querySelector('.ui-review-capability-comments__comment__content.ui-review-capability-comments__comment__content')?.textContent.trim() || 'Sem comentários';
              const stars = d.querySelector('.andes-visually-hidden').textContent || 'sem contagem';
              const created = d.querySelector('.ui-review-capability-comments__comment__date').textContent || '00/00/0000';

              const photos = [];
              const imgs = d.querySelectorAll('img');
              imgs.forEach((img) => {
                const src = img.getAttribute('data-src') || img.getAttribute('src');
                if (src && !src.includes('base64')) {
                  photos.push(src);
                }
              });

              reviews.push({ comment, photos, stars, created });
            });
            console.log(reviews);
            return { reviews };
          });
        }
      );

      const reviews = await page.$$eval('#reviews_capability_v3 > div > section > div > div:nth-child(1) > div:nth-child(1) > div.ui-review-capability__rating', elements => {
        return elements.map(element => {
          const rating = element.querySelector('div > .ui-review-capability__rating__average.ui-review-capability__rating__average--desktop')?.textContent || '0';
          const avaliacoes = element.querySelector('div > .ui-review-capability__rating__label')?.textContent || 'Sem comentários';
          return { rating, avaliacoes };
        });
      });

      return { reviews, detail: reviews_detail?.length > 0 && reviews_detail[0]?.reviews };
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = { fetchProductReviews };