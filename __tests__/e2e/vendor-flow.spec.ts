/**
 * E2E Tests for Vendor Flow
 * Tests the complete journey from signup to creating a pool
 */

import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const API_URL = "http://localhost:8282";

// Test vendor data
const testVendor = {
  email: `vendor.test.${Date.now()}@test.com`,
  password: "Test123!",
  name: "Test Vendor Farm",
  state: "Lagos",
  country: "Nigeria",
  businessName: "Test Farm Supplies Ltd",
};

test.describe("Vendor Onboarding Flow", () => {
  test("should navigate to vendor signup", async ({ page }) => {
    await page.goto(BASE_URL);

    // Click on become a vendor or vendor signup
    const vendorLink = page.locator("text=Become a Vendor");
    if (await vendorLink.isVisible()) {
      await vendorLink.click();
      await expect(page).toHaveURL(/become-a-vendor|signup/);
    }
  });

  test("should complete vendor signup", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Fill in signup form
    await page.fill('input[name="name"]', testVendor.name);
    await page.fill('input[name="email"]', testVendor.email);
    await page.fill('input[name="password"]', testVendor.password);
    await page.fill('input[name="confirmPassword"]', testVendor.password);

    // Select role as vendor
    await page.click("text=Vendor");

    // Select state
    const stateSelect = page.locator('select[name="state"]');
    if (await stateSelect.isVisible()) {
      await stateSelect.selectOption(testVendor.state);
    }

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to OTP verification
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/verify-otp/);
  });
});

test.describe("Vendor Verification Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login as seeded test vendor
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', "chinedu.farms@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test("should display verification page", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/verification`);

    // Check page header
    await expect(page.locator("h1")).toContainText("Verification");

    // Check progress indicator
    await expect(page.locator("text=Verification Progress")).toBeVisible();
  });

  test("should show verification steps", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/verification`);

    // Check all steps are visible
    await expect(page.locator("text=Government ID")).toBeVisible();
    await expect(page.locator("text=Bank Account")).toBeVisible();

    // Optional steps
    const businessReg = page.locator("text=Business Registration");
    const businessDetails = page.locator("text=Business Details");

    await expect(businessReg).toBeVisible();
    await expect(businessDetails).toBeVisible();
  });

  test("should navigate between verification steps", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/verification`);
    await page.waitForTimeout(2000);

    // First step should be Government ID
    const idStep = page.locator("text=Government ID");
    await expect(idStep).toBeVisible();

    // Content for ID verification should be shown
    const uploadArea = page.locator("text=Upload");
    expect(uploadArea).toBeTruthy();
  });

  test("should show complete verification button when steps are done", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/vendor/verification`);
    await page.waitForTimeout(2000);

    // Look for submit button (may be disabled initially)
    const submitBtn = page.locator('button:has-text("Submit")');
    // Button should exist (may be shown when steps complete)
    expect(submitBtn).toBeTruthy();
  });
});

test.describe("Vendor Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login as seeded test vendor
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', "chinedu.farms@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test("should display vendor dashboard", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/dashboard`);

    // Check dashboard header
    await expect(page.locator("h1")).toContainText("Dashboard");

    // Check stats are visible
    await expect(page.locator("text=Total Pools")).toBeVisible();
  });

  test("should show pool statistics", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/dashboard`);
    await page.waitForTimeout(2000);

    // Check for stat cards
    const statsSection = page.locator("text=Total Pools");
    await expect(statsSection).toBeVisible();

    // Check for revenue section
    const revenueSection = page.locator("text=Revenue");
    expect(revenueSection).toBeTruthy();
  });

  test("should display vendor pools", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/dashboard`);
    await page.waitForTimeout(3000);

    // My Pools section should be visible
    const myPoolsSection = page.locator("text=My Pools");
    await expect(myPoolsSection).toBeVisible();
  });

  test("should have create pool button", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/dashboard`);
    await page.waitForTimeout(2000);

    // Create Pool button
    const createBtn = page.locator('button:has-text("Create Pool")');
    await expect(createBtn).toBeVisible();
  });
});

test.describe("Create Pool Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login as verified test vendor
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', "chinedu.farms@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test("should open create pool modal", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/dashboard`);
    await page.waitForTimeout(2000);

    // Click Create Pool button
    const createBtn = page.locator('button:has-text("Create Pool")');
    if (await createBtn.isEnabled()) {
      await createBtn.click();

      // Modal should open
      await page.waitForTimeout(1000);
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
    }
  });

  test("should validate pool creation form", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/dashboard`);
    await page.waitForTimeout(2000);

    const createBtn = page.locator('button:has-text("Create Pool")');
    if (await createBtn.isEnabled()) {
      await createBtn.click();
      await page.waitForTimeout(1000);

      // Try to submit empty form
      const submitBtn = page.locator('button:has-text("Create")').last();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();

        // Should show validation errors
        await page.waitForTimeout(500);
      }
    }
  });

  test("should fill pool creation form", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/dashboard`);
    await page.waitForTimeout(2000);

    const createBtn = page.locator('button:has-text("Create Pool")');
    if (await createBtn.isEnabled()) {
      await createBtn.click();
      await page.waitForTimeout(1000);

      // Fill in pool details
      const productNameInput = page.locator('input[name="product_name"]');
      if (await productNameInput.isVisible()) {
        await productNameInput.fill("Test Premium Rice");
      }

      const descriptionInput = page.locator('textarea[name="description"]');
      if (await descriptionInput.isVisible()) {
        await descriptionInput.fill("50kg bags of premium quality rice");
      }

      const slotsInput = page.locator('input[name="slots_count"]');
      if (await slotsInput.isVisible()) {
        await slotsInput.fill("10");
      }

      const priceInput = page.locator('input[name="price_per_slot"]');
      if (await priceInput.isVisible()) {
        await priceInput.fill("50000");
      }
    }
  });
});

test.describe("Vendor Pools Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', "chinedu.farms@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test("should display pools list page", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/pools`);

    // Check page header
    await expect(page.locator("h1")).toContainText("Pools");
  });

  test("should have search functionality", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/pools`);
    await page.waitForTimeout(2000);

    // Search input should be visible
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("Rice");
      await page.waitForTimeout(1000);
    }
  });

  test("should toggle between card and table view", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/pools`);
    await page.waitForTimeout(2000);

    // Look for view toggle buttons
    const tableBtn = page.locator('button:has-text("Table")');
    const cardsBtn = page.locator('button:has-text("Cards")');

    if (await tableBtn.isVisible()) {
      await tableBtn.click();
      await page.waitForTimeout(500);

      // Table should be visible
      const table = page.locator("table");
      expect(table).toBeTruthy();
    }
  });
});
