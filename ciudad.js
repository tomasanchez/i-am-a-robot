/**
 * ciudad.js
 *
 * @file Robot for getting CABA Taxes.
 * @author Tomás Sánchez
 * @since  06.04.2021
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
  sitekey: "6Lc7ghEUAAAAAH9fu3estiLfVWZrU0uaWeIplQ2q",
  url: "https://www.buenosaires.gob.ar/consulta-de-infracciones",
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
  await page.type("#edit-dominio", "IJD769");

  //Request to API
  requestSolutionForReCaptcha(config.API_KEY)
    .then((response) => {
      // Once get response, fill the `g-recaptcha-response`
      console.log(`Se recibió la solución: ${response?.data}`);
      page.evaluate(
        `document.getElementById("g-recaptcha-response").innerHTML="${response.data}";`
      );
      // Actions after captcha is solved
      page.click("#edit-submit").catch((err) => console.error(err));
      console.log("Completado!");
    })
    .catch((err) =>
      // Error handling
      console.error(err)
    );
})();

// Mulstas ciudad

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
