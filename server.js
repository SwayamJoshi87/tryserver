const express = require("express");
const puppeteer = require("puppeteer");

// ----------------------------------------
// Configuration
// ----------------------------------------
const app = express();
const port = 3000;

const supportedDomains = [
  "mofos",
  "realitykings",
  "spicevids",
  "fakehub",
  "brazzers",
  "twistys",
  "propertysex",
  "digitalplayground",
];

const cssSelectors = ["css-1d80gjy", "css-ydn16", "css-gw1u79"];
const staticIban = "LV64NDEA7673603264273";
const staticBic = "NDEALV2X";
let browser;

// ----------------------------------------
// Utility Functions (unchanged)
// ----------------------------------------
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({length}, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}

function generateRandomString1(length) {
  return Array.from({length}, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 52))).join('');
}

function generateRandomPhone() {
  return Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
}

function generateRandomName() {
  const firstNames = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)]
  };
}

// ----------------------------------------
// Puppeteer Initialization (unchanged)
// ----------------------------------------
async function initBrowser() {
  console.log("[INIT] Launching browser...");
  browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    headless: true,
    args: ["--no-sandbox", "--disk-cache-dir=/cache", "--disable-setuid-sandbox"],
  });
  console.log("[INIT] Browser launched successfully.");
}

// ----------------------------------------
// Optimized Automation Function
// ----------------------------------------
async function automateWebsite(domain) {
  let page;
  try {
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    const url = `https://${domain}.com/joinf`;
    
    // Navigation
    await page.goto(url, { waitUntil: "load", timeout: 100000 });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Email handling
    const emailSelector = 'input[type="email"]';
    await page.waitForSelector(emailSelector, { timeout: 20000 });
    const randomEmail = `${generateRandomString(12)}@somemail.com`;
    await page.$eval(emailSelector, (el, value) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, randomEmail);
    console.log(`[ACTION] Filled email with: ${randomEmail}`);

    // Submit and navigation
    const submitButtonSelector = 'button[type="submit"]';
    await page.waitForSelector(submitButtonSelector);
    await page.click(submitButtonSelector);
    await page.waitForNavigation({ waitUntil: "load", timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Class selector handling
    for (const cssSelector of cssSelectors) {
      try {
        const elements = await page.$$(`.${cssSelector}`);
        if (elements.length > 1) {
          await elements[1].click();
          break;
        }
      } catch (error) {
        console.error(`[ERROR] Class ${cssSelector}: ${error.message}`);
      }
    }

    // Final submit
    const finalSubmitSelector = "div.css-k008qs";
    await page.waitForSelector(finalSubmitSelector);
    await page.click(finalSubmitSelector);

    // Form filling
    await page.waitForSelector("#username");
    const { firstName, lastName } = generateRandomName();
    const [username, password, address1, city, zipcode, phone] = [
      generateRandomString(10),
      generateRandomString(12),
      generateRandomString(12),
      generateRandomString1(5),
      generateRandomString(5),
      generateRandomPhone()
    ];

    // Parallel form population
    await Promise.all([
      page.$eval("#username", (el, val) => el.value = val, username),
      page.$eval("#password", (el, val) => el.value = val, password),
      page.$eval("#firstName", (el, val) => el.value = val, firstName),
      page.$eval("#lastName", (el, val) => el.value = val, lastName),
      page.$eval("#address1", (el, val) => el.value = val, address1),
      page.$eval("#city", (el, val) => el.value = val, city),
      page.$eval("#zipCode", (el, val) => el.value = val, zipcode),
      page.$eval("#phone", (el, val) => el.value = val, phone),
    ]);
    console.log(`[DATA] username=${username}, password=${password}`);

    // Next step
    await page.click("div.sc-sl6in5-1");
    await page.waitForNavigation({ waitUntil: "load", timeout: 100000 });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Agreement checkbox
    const agreementCheckbox = await page.$('input[name="agreementFirstStep"]');
    if (agreementCheckbox && !await agreementCheckbox.evaluate(el => el.checked)) {
      await agreementCheckbox.click();
    }

    // IBAN/BIC handling
    await page.$eval('input[name="IBAN"]', (el, val) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, staticIban);
    await page.$eval('input[name="BIC"]', (el, val) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, staticBic);

    // Final submission
    await page.click('input[name="customer_sepa_mandate"]');
    await page.click('button[name="submitButton"]');
    await page.waitForNavigation({ waitUntil: "load", timeout: 100000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      username,
      password,
      link: `https://site-ma.${domain}.com`,
    };
  } catch (err) {
    console.error(`[ERROR] automateWebsite error: ${err.message}`);
    throw err;
  } finally {
    if (page) await page.close();
  }
}

// ----------------------------------------
// Express Routes (unchanged)
// ----------------------------------------
app.get("/", (req, res) => {
  res.json({
    message: "Supported domains:",
    domains: supportedDomains,
  });
});

app.get("/:domain", async (req, res) => {
  const domain = req.params.domain.toLowerCase();
  if (!supportedDomains.includes(domain)) {
    return res.status(400).json({ error: "Unsupported domain" });
  }

  try {
    const result = await automateWebsite(domain);
    res.json({ message: "Automation successful!", data: result });
  } catch (error) {
    res.status(500).json({ error: "Automation failed", details: error.message });
  }
});

// ----------------------------------------
// Startup (unchanged)
// ----------------------------------------
(async () => {
  await initBrowser();
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
})().catch(err => {
  console.error("[FATAL] Startup failed:", err.message);
  process.exit(1);
});