/**
 * index.js
 *
 * @file  ReCaptcha bot solver
 * @author Tomás Sánchez
 * @since  06.01.2021
 */

import axios from "axios";
import puppeteer from "puppeteer";

import config from "./config.js";
import mockdata from "./mockdata.js";

/**
 * Configuration for chrome browser.
 */
const chromeOptions = {
  headless: false,
  defaultViewport: null,
  slowMo: 15,
};

/**
 * Site details.
 */
const siteDetails = {
  sitekey: "6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC",
  url: "https://old.reddit.com/login",
};

/**
 * Bot.
 */
(async function main() {
  // Open chrome and navigate to website.
  console.log("Abriendo Chrome...");
  const browser = await puppeteer.launch(chromeOptions);
  console.log("Abriendo pestaña...");
  const page = await browser.newPage();
  console.log(`Navegando a: ${siteDetails.url}`);
  await page.goto(siteDetails.url);

  // Fill required fields
  console.log("Rellenando formulario...");
  await page.type("#user_reg", mockdata.user);
  const password = mockdata.password;
  await page.type("#passwd_reg", password);
  await page.type("#passwd2_reg", password);
  console.log(`Se completó: Username:${mockdata.user}\tPassword:${password}`);

  //Request to API
  requestSolutionForReCaptcha(config.API_KEY)
    .then((response) => {
      // Once get response, fill the `g-recaptcha-response`
      console.log(`Se recibió la solución: ${response?.data}`);
      page.evaluate(
        `document.getElementById("g-recaptcha-response").innerHTML="${response.data}";`
      );
      // Actions after captcha is solved
      page.click("#register-form button[type=submit]");
      console.log("Completado!");
    })
    .catch((err) =>
      // Error handling
      console.error(err)
    );
})();

/**
 * Request recaptcha solution.
 *
 * @param {String} apiKey the Key for the API
 * @returns {AxiosInstance.post} the promise.
 */
function requestSolutionForReCaptcha(apiKey) {
  const API = axios.create({
    baseURL: config.API_URL,
  });

  const data = {
    websiteKey: siteDetails.sitekey,
    key: apiKey,
    websiteURL: siteDetails.url,
  };
  console.log("Solicitando resolver Captcha");
  return API.post("/", data);
}
