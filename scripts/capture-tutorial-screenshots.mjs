/**
 * Captures screenshots of the OttLeszek web app for the Word tutorial.
 * Requires: backend at http://localhost:3000, mobile web at http://localhost:8081
 * Run: pnpm run dev:backend (terminal 1), pnpm run dev:mobile (terminal 2), then press 'w' for web.
 * Then: node scripts/capture-tutorial-screenshots.mjs
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, "..", "docs", "word-tutorial", "images");
const BASE_URL = process.env.APP_URL || "http://localhost:8081";

async function main() {
  await mkdir(IMAGES_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const screenshot = async (name) => {
    const file = path.join(IMAGES_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("Saved:", file);
  };

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  try {
    console.log("Opening", BASE_URL);
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
    await delay(2000);

    // Wait for welcome (OttLeszek title)
    await page.getByText("OttLeszek", { exact: true }).waitFor({ state: "visible", timeout: 10000 });
    await screenshot("screenshot-welcome");

    await page.getByText("Tovább", { exact: true }).first().click();
    await delay(800);
    await page.getByText("Adatkezelés és hozzájárulás").waitFor({ state: "visible", timeout: 5000 });
    await screenshot("screenshot-consent");

    await page.getByText("Elfogadom, tovább", { exact: true }).first().click();
    await delay(800);
    await page.getByText("Belépés", { exact: true }).first().waitFor({ state: "visible", timeout: 5000 });
    await screenshot("screenshot-login");

    await page.getByPlaceholder("pl. teszt@example.com").fill("teszt@example.com");
    await page.getByText("Kód kérése", { exact: true }).first().click();
    await delay(1500);
    await page.getByPlaceholder("6 jegyű kód").fill("123456");
    await page.getByText("Belépés", { exact: true }).first().click();
    await delay(5000);

    // Dashboard
    await page.getByText(/Elköteleződés|Még nincs terved|Részveszek/).first().waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
    await delay(500);
    await screenshot("screenshot-dashboard");

    // Terv tab — navigate by URL (Expo Router web paths)
    await page.goto(BASE_URL + "/(tabs)/plan", { waitUntil: "networkidle", timeout: 15000 });
    await delay(1500);
    await screenshot("screenshot-plan");

    // Create plan and add step for checklist screenshot
    const createPlanBtn = page.getByText("Terv létrehozása", { exact: true });
    if (await createPlanBtn.first().isVisible().catch(() => false)) {
      await createPlanBtn.first().click();
      await delay(800);
    }
    const addStepInput = page.getByPlaceholder("Új lépés");
    if (await addStepInput.isVisible().catch(() => false)) {
      await addStepInput.fill("Elmegyek szavazni");
      await page.getByText("Lépés hozzáadása", { exact: true }).first().click();
      await delay(600);
    }

    // Emlékeztetők tab
    await page.goto(BASE_URL + "/(tabs)/reminders", { waitUntil: "networkidle", timeout: 15000 });
    await delay(1000);
    await screenshot("screenshot-reminders");

    // Back to Főoldal
    await page.goto(BASE_URL + "/(tabs)", { waitUntil: "networkidle", timeout: 15000 });
    await delay(1000);
    await screenshot("screenshot-checklist");

    // Kapcsolat tab
    await page.goto(BASE_URL + "/(tabs)/outreach", { waitUntil: "networkidle", timeout: 15000 });
    await delay(1000);
    await screenshot("screenshot-outreach");

    // Beállítások tab
    await page.goto(BASE_URL + "/(tabs)/settings", { waitUntil: "networkidle", timeout: 15000 });
    await delay(1000);
    await screenshot("screenshot-settings");

    console.log("All screenshots saved to", IMAGES_DIR);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
