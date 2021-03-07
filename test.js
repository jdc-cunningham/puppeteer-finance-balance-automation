require('dotenv').config({
  path: __dirname + '/.env'
});
const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch({
//     args: [`--window-size=1280,720`]
//   });
//   const page = await browser.newPage();
//   page
//     .waitForSelector('#globalInputsValidationForm', {visible: true})
//     .then(() => {
//       console.log('then');
//       page.goto('https://www.bankofamerica.com/');
//       page.screenshot({ path: 'example.png' });
//       browser.close();
//     })
//     .catch((err) => {
//       console.log('err', err);
//       browser.close();
//     });
// })();

// puppeteer.launch().then(async browser => {
//   const page = await browser.newPage();
//   page
//     .goto('https://www.bankofamerica.com/')
//     .waitForSelector('#globalInputsValidationForm')
//     .then(() => console.log('got it'))
//     .catch((err) => console.log('err', err));
//     browser.close();
// });



(async () => {
  const user = process.env.BANK_OF_AMERICA_USER;
  const pass = process.env.BANK_OF_AMERICA_PASS;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });
  await page.goto('https://www.bankofamerica.com/');
  await page.waitForSelector('#globalInputsValidationForm');

  // fill in user/pass fields
  await page.$eval('#onlineId1', (el, user) => el.value = user, user);
  await page.$eval('#passcode1', (el, pass) => el.value = pass, pass);
  await page.$eval('#signIn', el => el.click());
  await page.waitForNavigation({ waitUntil: 'networkidle2' }),

  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();