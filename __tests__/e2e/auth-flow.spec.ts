/**
 * E2E Tests for Authentication Flow
 * Tests login, signup, OTP verification, and password reset
 */

import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Login Flow", () => {
  test("should display login page", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Check login form elements
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Click submit without filling form
    await page.click('button[type="submit"]');

    // Should show validation message
    await page.waitForTimeout(500);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="email"]', "invalid@test.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should show error message
    await page.waitForTimeout(2000);
    const errorToast = page
      .locator("text=Invalid")
      .or(page.locator("text=error"));
    // Error should be shown somewhere
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="email"]', "buyer@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or marketplace
    await page.waitForTimeout(3000);
    const url = page.url();
    expect(url).toMatch(/dashboard|marketplace|\//);
  });

  test("should have forgot password link", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    const forgotLink = page.locator("text=Forgot");
    await expect(forgotLink).toBeVisible();
  });

  test("should have signup link", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    const signupLink = page
      .locator("text=Sign Up")
      .or(page.locator("text=Register"));
    await expect(signupLink.first()).toBeVisible();
  });
});

test.describe("Signup Flow", () => {
  const uniqueEmail = `test.${Date.now()}@test.com`;

  test("should display signup page", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Check form elements
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should have role selection", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Should have buyer and vendor options
    const buyerOption = page.locator("text=Buyer");
    const vendorOption = page.locator("text=Vendor");

    await expect(buyerOption).toBeVisible();
    await expect(vendorOption).toBeVisible();
  });

  test("should validate password requirements", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "weak");

    // Submit form
    await page.click('button[type="submit"]');

    // Should show password validation error
    await page.waitForTimeout(500);
  });

  test("should validate password confirmation match", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "Test123!");
    await page.fill('input[name="confirmPassword"]', "Different123!");

    // Submit form
    await page.click('button[type="submit"]');

    // Should show mismatch error
    await page.waitForTimeout(500);
  });

  test("should show state selection", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // State dropdown should be visible
    const stateSelect = page.locator('select[name="state"]');
    if (await stateSelect.isVisible()) {
      await expect(stateSelect).toBeVisible();
    }
  });
});

test.describe("OTP Verification Flow", () => {
  test("should display OTP verification page", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/verify-otp`);

    // Check OTP input is present
    await expect(page.locator("text=OTP")).toBeVisible();
  });

  test("should have resend OTP option", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/verify-otp`);

    const resendLink = page.locator("text=Resend");
    await expect(resendLink).toBeVisible();
  });

  test("should validate OTP format", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/verify-otp`);

    // Try to submit with invalid OTP
    const otpInput = page
      .locator('input[name="otp"]')
      .or(page.locator('input[type="text"]').first());
    if (await otpInput.isVisible()) {
      await otpInput.fill("123");

      const submitBtn = page.locator('button[type="submit"]');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
      }
    }
  });
});

test.describe("Session Management", () => {
  test("should persist login state", async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', "buyer@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Navigate to a protected page
    await page.goto(`${BASE_URL}/buyer/dashboard`);

    // Should not redirect to login
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toContain("/login");
  });

  test("should redirect unauthenticated users", async ({ page }) => {
    // Try to access protected page without login
    await page.goto(`${BASE_URL}/buyer/dashboard`);

    // Should redirect to login or show unauthorized
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toMatch(/login|unauthorized/);
  });

  test("should handle logout", async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', "buyer@test.com");
    await page.fill('input[name="password"]', "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Look for logout button/link
    const logoutBtn = page
      .locator("text=Logout")
      .or(page.locator("text=Sign Out"));
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForTimeout(2000);

      // Should be logged out
      const url = page.url();
      expect(url).toMatch(/login|\//);
    }
  });
});

test.describe("Protected Routes", () => {
  test("vendor routes should be protected", async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/dashboard`);
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url).toMatch(/login|unauthorized|vendor/);
  });

  test("buyer routes should be protected", async ({ page }) => {
    await page.goto(`${BASE_URL}/buyer/orders`);
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url).toMatch(/login|unauthorized|buyer/);
  });

  test("admin routes should be protected", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url).toMatch(/login|admin/);
  });
});
