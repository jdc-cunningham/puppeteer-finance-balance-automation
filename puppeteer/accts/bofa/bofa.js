require('dotenv').config({
  path: __dirname + '/.env'
});

const puppeteer = require('puppeteer');
const { getAuthCode } = require('../../auth-looper.js');

const getBofaBalance = async () => {
  const user = process.env.BANK_OF_AMERICA_USER;
  const pass = process.env.BANK_OF_AMERICA_PASS;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });
  await page.goto('https://www.bankofamerica.com/');
  await page.waitForSelector('#globalInputsValidationForm');

  // fill in user/pass fields, see step_1 image for reference
  await page.$eval('#onlineId1', (el, user) => el.value = user, user);
  await page.$eval('#passcode1', (el, pass) => el.value = pass, pass);
  await page.$eval('#signIn', el => el.click());
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // see step_2 image
  await page.waitForSelector('#RequestAuthCodeForm');

  await page.$eval('#btnARContinue', el => el.click());
  // trigger auth code message and wait for person to respond
  let attempts = 0;
  const authCode = await getAuthCode(attempts, 'bofa');
  // see step_3
  await page.$eval('#tlpvt-acw-authnum', (el, authCode) => el.value = authCode, authCode);
  // don't remember this computer
  await page.$eval('#no-recognize', el => el.click());
  // lol anchor tag
  await page.$eval('#continue-auth-number', el => el.click());
  // wait for next page, should be logged in step_4
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  const bofaBal = await page.$eval('.balanceValue.TL_NPI_L1', el => el.textContent);
  await browser.close();

  return bofaBal || false;
};

module.exports = {
  getBofaBalance
};