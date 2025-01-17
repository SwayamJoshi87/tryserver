const express = require("express");
const puppeteer = require("puppeteer");

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

const cssSelectors = ["css-1d80gjy", "css-ydn16", "css-gw1u79"]; // List of class names to search for

// Function to generate a random alphanumeric string of a given length
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to generate a random string of alphabets of a given length
function generateRandomString1(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to generate a random phone number (10 digits)
function generateRandomPhone() {
  let phone = "";
  for (let i = 0; i < 10; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
}

// Function to generate a random name (first and last)
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

// Helper function to calculate IBAN check digits
function calculateCheckDigits(iban) {
  const rearrangedIban = iban.slice(4) + iban.slice(0, 4);
  const expandedIban = rearrangedIban.replace(
    /[A-Z]/g,
    (match) => match.charCodeAt(0) - 55
  );
  const ibanBigInt = BigInt(expandedIban);
  const mod97 = ibanBigInt % 97n;
  const checkDigits = 98n - mod97;
  return checkDigits.toString().padStart(2, "0");
}

// Puppeteer automation function
async function automateWebsite(domain) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set the viewport to 1920x1080 resolution
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    const url = `https://${domain}.com/joinf`;

    // Navigate to the page
    await page.goto(url, { waitUntil: "load", timeout: 10000 });
    console.log(`Navigated to ${url}`);

    page.waitForNavigation();

    // Wait for 5 seconds after the page loads
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Waited for 5 seconds after page load.");

    // Wait for the email input field (input[type="email"]) to load
    const emailSelector = 'input[type="email"]';
    console.log("Email input field loaded.");
    // Fill the email field with a random email
    const randomEmail = `${generateRandomString(12)}@somemail.com`;
    await page.type(emailSelector, randomEmail);
    console.log(`Filled email field with: ${randomEmail}`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Wait for the submit button (button[type="submit"]) to load
    const submitButtonSelector = 'button[type="submit"]';
    console.log("Submit button loaded.");

    // Click the submit button
    await page.click(submitButtonSelector);
    console.log("Submit button clicked.");

    // Wait for the new page to load
    await page.waitForNavigation({ waitUntil: "load", timeout: 10000 });

    console.log("New page loaded.");

    await new Promise((resolve) => setTimeout(resolve, 5000));
    // Attempt to interact with elements using class names
    for (const cssSelector of cssSelectors) {
      try {
        console.log(`Trying to find elements with class ${cssSelector}`);
        const elements = await page.$$(`.${cssSelector}`);
        if (elements.length > 1) {
          await elements[1].click();
          console.log(`Clicked the second element with class ${cssSelector}`);
          break;
        }
      } catch (error) {
        console.log(
          `Failed to interact with class ${cssSelector}: ${error.message}`
        );
      }
    }

    // Click submit
    await page.waitForSelector("div.css-k008qs");
    await page.click("div.css-k008qs");

    // Wait for the form to appear
    await page.waitForSelector("#username");

    // Generate random data for the form fields
    const { firstName, lastName } = generateRandomName();
    const username = generateRandomString(10);
    const password = generateRandomString(12);
    const address1 = generateRandomString(12);
    const city = generateRandomString1(5);
    const zipcode = generateRandomString(5);
    const phone = generateRandomPhone();

    // Fill in the form fields
    await page.type("#username", username);
    await page.type("#password", password);
    await page.type("#firstName", firstName);
    await page.type("#lastName", lastName);
    await page.type("#address1", address1);
    await page.type("#city", city);
    await page.type("#zipCode", zipcode);
    await page.type("#phone", phone);

    await page.click("div.sc-sl6in5-1");

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: "load", timeout: 100000 });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Check the agreementFirstStep checkbox
    const agreementCheckbox = await page.$('input[name="agreementFirstStep"]');
    if (agreementCheckbox) {
      const isChecked = await agreementCheckbox.evaluate((el) => el.checked);
      if (!isChecked) {
        await agreementCheckbox.evaluate((b) => b.click());
        console.log("Checked the agreementFirstStep checkbox.");
      }
    } else {
      console.error("agreementFirstStep checkbox not found.");
    }

    const page1 = await browser.newPage(); // Create a new page
    await page1.setViewport({ width: 1920, height: 1080 });

    // Navigate to the website that contains the IBAN
    await page1.goto("https://fakeit.receivefreesms.co.uk/c/lv/"); // Replace with the actual URL of the page containing the IBAN
    await new Promise((resolve) => setTimeout(resolve, 10000));
    // Extract the IBAN from the page
    const iban = await page1.$eval("#ibanLoading", (el) =>
      el.textContent.trim()
    );
    const bic = await page1.$eval("#bicLoading", (el) => el.textContent.trim());
    console.log("IBAN extracted:", iban);
    console.log("BIC extracted:", bic);

    // Close the browser
    await page1.close();

    // Wait for the IBAN input field to be available and fill it
    await page.waitForSelector('input[name="IBAN"]');
    await page.type('input[name="IBAN"]', iban);
    console.log(`Filled IBAN: ${iban}`);

    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Check the customer_sepa_mandate checkbox
    const sepaCheckbox = await page.$('input[name="customer_sepa_mandate"]');
    if (sepaCheckbox) {
      const isChecked = await sepaCheckbox.evaluate((el) => el.checked);
      if (!isChecked) {
        await sepaCheckbox.click();
        console.log("Checked the customer_sepa_mandate checkbox.");
      }
    } else {
      console.error("customer_sepa_mandate checkbox not found.");
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Wait for the BIC input field to be available and fill it

    await page.waitForSelector('input[name="BIC"]');
    await page.type('input[name="BIC"]', bic);
    console.log(`Filled BIC: ${bic}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Wait for the button with name="submitButton" and click it
    await page.waitForSelector('button[name="submitButton"]');
    await page.click('button[name="submitButton"]');

    page.waitForNavigation();
    await new Promise((resolve) => setTimeout(resolve, 10000));
    page.waitForNavigation();

    // Wait for 10 seconds for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 20000));
    console.log(username);
    console.log(password);
    return {
      username,
      password,
      link: `https://${domain}.com`,
    };
  } catch (err) {
    console.error(`Error automating website: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// Route to serve the list of domains
app.get("/", (req, res) => {
  res.json({
    message: "Supported domains:",
    domains: supportedDomains,
  });
});

// Route to handle domain-specific automation
app.get("/:domain", async (req, res) => {
  const domain = req.params.domain.toLowerCase();

  if (!supportedDomains.includes(domain)) {
    return res.status(400).json({
      error: "Unsupported domain. Please choose from the supported domains.",
    });
  }

  try {
    const result = await automateWebsite(domain);
    res.json({
      message: "Automation successful!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred during automation.",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
