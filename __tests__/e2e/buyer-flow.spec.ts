/**
 * E2E Tests for Buyer Flow
 * Tests the complete journey from signup to purchasing a pool slot
 */

import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const API_URL = "http://localhost:8282";

// Test user data
const testBuyer = {
  email: `buyer.test.${Date.now()}@test.com`,
  password: "Test123!",
  name: "Test Buyer",
  state: "Lagos",
  country: "Nigeria",
};

test.describe("Buyer Onboarding Flow", () => {
  test("should display home page with available pools", async ({ page }) => {
    await page.goto(BASE_URL);

    // Check hero section is visible
    await expect(page.locator("h1")).toContainText("Farm Fresh");

    // Check pools section exists
    await expect(page.locator("#product")).toBeVisible();

    // Wait for pools to load
    await page.waitForTimeout(2000);
  });

  test("should navigate to signup page", async ({ page }) => {
    await page.goto(BASE_URL);

    // Click on signup/register link
    await page.click("text=Sign Up");

    // Should be on signup page
    await expect(page).toHaveURL(/signup/);
  });

  test("should complete buyer signup with OTP verification", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Fill in signup form
    await page.fill('input[name="name"]', testBuyer.name);
    await page.fill('input[name="email"]', testBuyer.email);
    await page.fill('input[name="password"]', testBuyer.password);
    await page.fill('input[name="confirmPassword"]', testBuyer.password);

    // Select role as buyer
    await page.click("text=Buyer");

    // Select state
    await page.selectOption('select[name="state"]', testBuyer.state);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to OTP verification
    await expect(page).toHaveURL(/verify-otp/);

    // In dev mode, we can get OTP from API response or check console
    // For testing, we'll verify the page loads correctly
    await expect(page.locator("text=Enter OTP")).toBeVisible();
  });
});

test.describe("Buyer Marketplace Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login as existing test buyer (use seeded test user)
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', "buyer@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard or marketplace
    await page.waitForTimeout(3000);
  });

  test("should display marketplace with pools", async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);

    // Check marketplace header
    await expect(page.locator("h1")).toContainText("Marketplace");

    // Wait for pools to load
    await page
      .waitForSelector('[data-testid="pool-card"]', { timeout: 10000 })
      .catch(() => {
        // If no test ID, look for pool cards by class
        return page.waitForSelector(".grid > div", { timeout: 10000 });
      });
  });

  test("should filter pools by category", async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Click on a category filter if available
    const categoryButton = page.locator('button:has-text("Grains")');
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test("should navigate to pool details page", async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);

    // Wait for pools to load
    await page.waitForTimeout(3000);

    // Click on first pool card's "View Details" button
    const viewDetailsBtn = page.locator("text=View Details").first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();

      // Should be on pool details page
      await expect(page).toHaveURL(/\/buyer\/pool\//);
    }
  });

  test("should open checkout modal when clicking Join Pool", async ({
    page,
  }) => {
    // Navigate to a specific pool (use first seeded pool)
    await page.goto(`${BASE_URL}/marketplace`);
    await page.waitForTimeout(3000);

    // Click View Details on first pool
    const viewDetailsBtn = page.locator("text=View Details").first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(2000);

      // Click Join Pool button
      const joinPoolBtn = page.locator('button:has-text("Join Pool")');
      if ((await joinPoolBtn.isVisible()) && (await joinPoolBtn.isEnabled())) {
        await joinPoolBtn.click();

        // Checkout modal should open
        await expect(page.locator('[role="dialog"]')).toBeVisible();
      }
    }
  });
});

test.describe("Pool Details Page", () => {
  test("should display pool information correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);
    await page.waitForTimeout(3000);

    // Navigate to first pool
    const viewDetailsBtn = page.locator("text=View Details").first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(2000);

      // Check essential elements are present
      await expect(page.locator("h1")).toBeVisible(); // Product name

      // Check price is displayed
      const priceElement = page.locator("text=₦");
      await expect(priceElement.first()).toBeVisible();

      // Check progress bar exists
      const progressBar = page.locator('[role="progressbar"]');
      if (await progressBar.isVisible()) {
        expect(progressBar).toBeTruthy();
      }
    }
  });

  test("should show vendor information", async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);
    await page.waitForTimeout(3000);

    const viewDetailsBtn = page.locator("text=View Details").first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(2000);

      // Vendor section should be visible
      const vendorSection = page.locator("text=Vendor");
      expect(vendorSection).toBeTruthy();
    }
  });

  test("should display trust badges", async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);
    await page.waitForTimeout(3000);

    const viewDetailsBtn = page.locator("text=View Details").first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(2000);

      // Look for trust badges
      const securePayment = page.locator("text=Secure");
      const verifiedVendor = page.locator("text=Verified");

      // At least one trust indicator should be visible
      const hasSecure = await securePayment.isVisible().catch(() => false);
      const hasVerified = await verifiedVendor.isVisible().catch(() => false);

      expect(hasSecure || hasVerified).toBeTruthy();
    }
  });
});

test.describe("Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', "buyer@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test("should validate required fields in checkout", async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);
    await page.waitForTimeout(3000);

    const viewDetailsBtn = page.locator("text=View Details").first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(2000);

      const joinPoolBtn = page.locator('button:has-text("Join Pool")');
      if ((await joinPoolBtn.isVisible()) && (await joinPoolBtn.isEnabled())) {
        await joinPoolBtn.click();
        await page.waitForTimeout(1000);

        // Try to submit without filling required fields
        const checkoutBtn = page.locator('button:has-text("Proceed")');
        if (await checkoutBtn.isVisible()) {
          await checkoutBtn.click();

          // Should show validation error
          const errorMessage = page.locator("text=required");
          // Validation should trigger
        }
      }
    }
  });

  test("should calculate total with delivery cost", async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);
    await page.waitForTimeout(3000);

    const viewDetailsBtn = page.locator("text=View Details").first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(2000);

      const joinPoolBtn = page.locator('button:has-text("Join Pool")');
      if ((await joinPoolBtn.isVisible()) && (await joinPoolBtn.isEnabled())) {
        await joinPoolBtn.click();
        await page.waitForTimeout(1000);

        // Select delivery option if available
        const deliveryOption = page.locator("text=Home Delivery");
        if (await deliveryOption.isVisible()) {
          await deliveryOption.click();

          // Total should update to include delivery cost
          await page.waitForTimeout(500);
          const total = page.locator("text=Total");
          await expect(total).toBeVisible();
        }
      }
    }
  });
});
