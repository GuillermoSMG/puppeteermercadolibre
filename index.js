import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const openWebpage = async () => {
  const browser = await puppeteer.launch({
    headless: 'false',
    slowMo: 200,
  });
  const page = await browser.newPage();

  await page.goto('https://example.com');
  await browser.close();
};

const screenshot = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({
    path: 'example.png',
  });
  await browser.close();
};

const navigate = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com');
  await page.click('a[href="/login"]');
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
};

const getData = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  const result = await page.evaluate(() => {
    const title = document.querySelector('h1').innerText;
    const description = document.querySelector('p').innerText;
    const moreInfo = document.querySelector('a').href;
    return { title, description, moreInfo };
  });
  await browser.close();
};

const handleDynamicPage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    'https://listado.mercadolibre.com.uy/laptop-hp#D[A:laptop%20hp]'
  );
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
// openWebpage();
// screenshot();
// navigate();
//getData();
handleDynamicPage();
