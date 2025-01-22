const express = require("express");
const puppeteer = require("puppeteer");

// ----------------------------------------
// Configuration
// ----------------------------------------
const app = express();
const port = 3000;

// List of supported domains
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

// CSS selectors to search for in the second step
const cssSelectors = ["css-1d80gjy", "css-ydn16", "css-gw1u79"];

// Static IBAN and BIC
const staticIban = "LV64NDEA7673603264273";
const staticBic = "NDEALV2X";

// Global browser reference
let browser;

// ----------------------------------------
// Utility / Helper functions
// ----------------------------------------

// Generate a random alphanumeric string
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate a random string of alphabets
function generateRandomString1(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate a random phone number (10 digits)
function generateRandomPhone() {
  let phone = "";
  for (let i = 0; i < 10; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
}

// Generate a random name (first and last)
function generateRandomName() {
  const firstNames = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName, lastName };
}

// ----------------------------------------
// Puppeteer initialization
// ----------------------------------------
async function initBrowser() {
  console.log("[INIT] Launching browser...");
  browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  console.log("[INIT] Browser launched successfully.");
}

// ----------------------------------------
// Automation function
// ----------------------------------------
async function automateWebsite(domain) {
  let page;
  try {
    // Open a new page
    console.log(`[INFO] Opening new page for domain: ${domain}`);
    page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    console.log("[INFO] Viewport set to 1920x1080");

    // Construct URL
    const url = `https://${domain}.com/joinf`;
    console.log(`[NAVIGATE] Going to: ${url}`);

    // Go to the page
    await page.goto(url, { waitUntil: "load", timeout: 100000 });
    console.log(`[NAVIGATE] Successfully loaded: ${url}`);

    // Wait a bit after page load
    console.log("[WAIT] Waiting 10 seconds to ensure page load...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Wait for email field
    const emailSelector = 'input[type="email"]';
    console.log("[INFO] Waiting for email input...");
    await page.waitForSelector(emailSelector, { timeout: 20000 });
    console.log("[INFO] Email input loaded.");

    // Fill the email field with a random email
    const randomEmail = `${generateRandomString(12)}@somemail.com`;
    await page.type(emailSelector, randomEmail);
    console.log(`[ACTION] Filled email with: ${randomEmail}`);

    // Wait 1 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Wait for submit button and click
    const submitButtonSelector = 'button[type="submit"]';
    console.log("[INFO] Waiting for the submit button...");
    await page.waitForSelector(submitButtonSelector, { timeout: 20000 });
    console.log("[INFO] Submit button loaded, clicking...");
    await page.click(submitButtonSelector);

    // Wait for navigation after clicking
    console.log("[NAVIGATE] Waiting for next page navigation...");
    await page.waitForNavigation({ waitUntil: "load", timeout: 10000 });
    console.log("[NAVIGATE] New page loaded.");

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Attempt to interact with elements using class names
    for (const cssSelector of cssSelectors) {
      try {
        console.log(`[INFO] Searching for elements with class: ${cssSelector}`);
        const elements = await page.$$(`.${cssSelector}`);
        if (elements.length > 1) {
          await elements[1].click();
          console.log(`[ACTION] Clicked second element with class: ${cssSelector}`);
          break;
        }
      } catch (error) {
        console.error(
          `[ERROR] Failed to interact with class ${cssSelector}: ${error.message}`
        );
      }
    }

    // Click submit (div.css-k008qs)
    const finalSubmitSelector = "div.css-k008qs";
    console.log("[INFO] Waiting for final submit (div.css-k008qs)...");
    await page.waitForSelector(finalSubmitSelector, { timeout: 30000 });
    console.log("[ACTION] Clicking final submit...");
    await page.click(finalSubmitSelector);

    // Wait for the sign-up form
    console.log("[INFO] Waiting for sign-up form (#username)...");
    await page.waitForSelector("#username", { timeout: 30000 });

    // Generate random data
    const { firstName, lastName } = generateRandomName();
    const username = generateRandomString(10);
    const password = generateRandomString(12);
    const address1 = generateRandomString(12);
    const city = generateRandomString1(5);
    const zipcode = generateRandomString(5);
    const phone = generateRandomPhone();

    console.log("[INFO] Filling form fields with random data...");
    await page.type("#username", username);
    await page.type("#password", password);
    await page.type("#firstName", firstName);
    await page.type("#lastName", lastName);
    await page.type("#address1", address1);
    await page.type("#city", city);
    await page.type("#zipCode", zipcode);
    await page.type("#phone", phone);

    console.log(`[DATA] username=${username}, password=${password}`);

    // Click the next step button (div.sc-sl6in5-1)
    const nextStepSelector = "div.sc-sl6in5-1";
    console.log("[ACTION] Clicking to go to next step...");
    await page.waitForSelector(nextStepSelector, { timeout: 20000 });
    await page.click(nextStepSelector);

    // Wait for next navigation
    console.log("[NAVIGATE] Waiting for next step to load...");
    await page.waitForNavigation({ waitUntil: "load", timeout: 100000 });
    console.log("[NAVIGATE] Next step loaded.");

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Check the agreementFirstStep checkbox
    const agreementCheckbox = await page.$('input[name="agreementFirstStep"]');
    if (agreementCheckbox) {
      const isChecked = await agreementCheckbox.evaluate((el) => el.checked);
      if (!isChecked) {
        await agreementCheckbox.evaluate((el) => el.click());
        console.log("[ACTION] Checked the agreementFirstStep checkbox.");
      } else {
        console.log("[INFO] agreementFirstStep checkbox was already checked.");
      }
    } else {
      console.error("[ERROR] agreementFirstStep checkbox not found.");
    }

    // Wait for the IBAN input field to be available and fill it
    console.log("[INFO] Waiting for IBAN input...");
    await page.waitForSelector('input[name="IBAN"]', { timeout: 30000 });
    await page.type('input[name="IBAN"]', staticIban);
    console.log(`[ACTION] Filled IBAN with: ${staticIban}`);

    // Wait 4 seconds
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Check the customer_sepa_mandate checkbox
    const sepaCheckbox = await page.$('input[name="customer_sepa_mandate"]');
    if (sepaCheckbox) {
      const isChecked = await sepaCheckbox.evaluate((el) => el.checked);
      if (!isChecked) {
        await sepaCheckbox.click();
        console.log("[ACTION] Checked the customer_sepa_mandate checkbox.");
      } else {
        console.log("[INFO] customer_sepa_mandate checkbox was already checked.");
      }
    } else {
      console.error("[ERROR] customer_sepa_mandate checkbox not found.");
    }

    // Wait 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Fill in the BIC
    console.log("[INFO] Waiting for BIC input...");
    await page.waitForSelector('input[name="BIC"]', { timeout: 30000 });
    await page.type('input[name="BIC"]', staticBic);
    console.log(`[ACTION] Filled BIC with: ${staticBic}`);

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Click submit button
    const finalButtonSelector = 'button[name="submitButton"]';
    console.log("[INFO] Waiting for final submit button...");
    await page.waitForSelector(finalButtonSelector, { timeout: 30000 });
    console.log("[ACTION] Clicking final submit button...");
    await page.click(finalButtonSelector);

    // Wait for final navigation
    console.log("[NAVIGATE] Waiting for final navigation...");
    await page.waitForNavigation({ waitUntil: "load", timeout: 100000 });
    console.log("[NAVIGATE] Final page loaded.");

    // Wait for 10 seconds for demonstration
    console.log("[WAIT] Waiting 10 seconds after final step...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    console.log(`[SUCCESS] Automation finished for domain: ${domain}`);
    return {
      username,
      password,
      link: `https://${domain}.com`,
    };
  } catch (err) {
    console.error(`[ERROR] automateWebsite error: ${err.message}`);
    throw err; // re-throw to be caught in the route
  } finally {
    // Ensure we close the page to free resources
    if (page) {
      console.log("[INFO] Closing page...");
      await page.close();
    }
  }
}

// ----------------------------------------
// Express Routes
// ----------------------------------------

// List supported domains
app.get("/", (req, res) => {
  console.log("[ROUTE] GET / - Listing supported domains.");
  res.json({
    message: "Supported domains:",
    domains: supportedDomains,
  });
});

// Domain automation endpoint
app.get("/:domain", async (req, res) => {
  const domain = req.params.domain.toLowerCase();
  console.log(`[ROUTE] GET /${domain} - Domain requested.`);

  if (!supportedDomains.includes(domain)) {
    console.warn(`[WARN] Domain not supported: ${domain}`);
    return res.status(400).json({
      error: "Unsupported domain. Please choose from the supported domains.",
    });
  }

  try {
    console.log(`[ACTION] Starting automation for ${domain}`);
    const result = await automateWebsite(domain);
    console.log(`[ACTION] Automation completed for ${domain}`);
    return res.json({
      message: "Automation successful!",
      data: result,
    });
  } catch (error) {
    console.error(`[ERROR] During automation for ${domain}: ${error.message}`);
    return res.status(500).json({
      error: "An error occurred during automation.",
      details: error.message,
    });
  }
});

// ----------------------------------------
// Startup
// ----------------------------------------
(async () => {
  await initBrowser(); // Initialize global browser once
  app.listen(port, () => {
    console.log(`[INIT] Server is running on http://localhost:${port}`);
  });
})().catch((err) => {
  console.error("[FATAL] Failed to launch the app:", err.message);
  process.exit(1);
});
