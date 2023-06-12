import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const handleDynamicPage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    'https://listado.mercadolibre.com.uy/laptop-hp#D[A:laptop%20hp]'
  );
  await page.screenshot({
    path: 'example.png',
  });
  const result = await page.evaluate(() => {
    const products = document.querySelectorAll('.andes-card');
    const data = [...products].map(product => {
      const prodName = product.querySelector(
        '.ui-search-item__title'
      ).innerText;
      const prodPrice = product.querySelector('.price-tag-amount').innerText;
      const prodReviews =
        product.querySelector('.ui-search-reviews')?.innerText;
      const highlight = product.querySelector(
        '.ui-search-item__highlight-label__text'
      )?.innerText;
      return {
        prodName,
        prodPrice,
        prodReviews,
        highlight,
      };
    });
    return data;
  });
  await fs.writeFile('products.json', JSON.stringify(result, null, 2));
  await browser.close();
};

handleDynamicPage();
