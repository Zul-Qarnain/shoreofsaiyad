import { expect, test, type Page } from "@playwright/test";

async function closeCart(page: Page) {
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
}

test("home page renders brand and featured products", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Shore of Saiyad/);
  await expect(page.getByRole("heading", { name: "Featured Products" })).toBeVisible();
  await expect(page.getByTestId("product-card")).toHaveCount(4);
});

test("product page adds the selected quantity and cart persists across reloads", async ({ page }) => {
  await page.goto("/products/3");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.locator("#quantity")).toHaveValue("3");
  await page.getByRole("main").getByRole("button", { name: "Add to Cart" }).first().click();

  const drawer = page.getByRole("dialog");
  await expect(drawer.getByText("3 items")).toBeVisible();
  await closeCart(page);
  await expect(page.getByTestId("cart-count")).toHaveText("3");

  await page.reload();
  await expect(page.getByTestId("cart-count")).toHaveText("3");
});

test("cart quantity cannot exceed stock", async ({ page }) => {
  await page.goto("/products/8"); // stock: 3
  await page.locator("#quantity").fill("50");
  await expect(page.locator("#quantity")).toHaveValue("3");
  await page.getByRole("main").getByRole("button", { name: "Add to Cart" }).first().click();
  await expect(page.getByRole("dialog").getByRole("button", { name: /Increase quantity/ })).toBeDisabled();
});

test("sold-out products cannot be added", async ({ page }) => {
  await page.goto("/products/7");
  await expect(page.getByText(/currently sold out/)).toBeVisible();
  await page.goto("/shop?q=nesting");
  await expect(page.getByTestId("product-card").getByRole("button", { name: "Sold out" })).toBeDisabled();
});

test("shop search and empty state", async ({ page }) => {
  await page.goto("/shop?q=necklace");
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await expect(page.getByTestId("result-count")).toHaveText("1 product");
  await page.goto("/shop?q=does-not-exist");
  await expect(page.getByTestId("no-results")).toBeVisible();
});

test("header search navigates to filtered shop", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search products" }).click();
  await page.getByLabel("Search query").fill("mug");
  await page.getByLabel("Search query").press("Enter");
  await expect(page).toHaveURL(/\/shop\?q=mug/);
  await expect(page.getByTestId("product-card")).toHaveCount(1);
});

test("checkout validates input, places an order and shows a real invoice", async ({ page }) => {
  await page.goto("/products/1");
  await page.getByRole("button", { name: "Buy Now" }).click();
  await expect(page).toHaveURL(/\/checkout/);

  await page.getByRole("button", { name: "Place Order" }).click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await expect(page.getByText(/valid Bangladeshi mobile number/)).toBeVisible();

  await page.getByLabel("Full name").fill("Ayesha Rahman");
  await page.getByLabel("Mobile number").fill("01712345678");
  await page.getByLabel("Full address").fill("House 12, Road 5, Dhanmondi");
  await page.getByLabel("City / District").fill("Dhaka");
  await page.getByText("Outside Dhaka").click();
  await expect(page.getByTestId("order-total")).toHaveText("৳175.00");
  await expect(page.getByTestId("pay-now")).toHaveText("৳130.00");
  await page.getByLabel("Transaction ID").fill("9A7B6C5D4E");
  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page).toHaveURL(/\/invoice\/SOS-/);
  await expect(page.getByTestId("invoice-customer")).toHaveText("Ayesha Rahman");
  await expect(page.getByTestId("invoice-total")).toHaveText("৳175.00");
  await expect(page.getByTestId("cart-count")).toHaveCount(0);

  await page.reload();
  await expect(page.getByTestId("invoice-customer")).toHaveText("Ayesha Rahman");
});

test("unknown invoice shows a helpful message", async ({ page }) => {
  await page.goto("/invoice/SOS-000000-ABCDEF");
  await expect(page.getByRole("heading", { name: "Invoice not found" })).toBeVisible();
});

test("unknown product returns 404", async ({ page }) => {
  const res = await page.goto("/products/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Page not found")).toBeVisible();
});

test("admin area requires login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Password").fill("wrong");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Incorrect password.")).toBeVisible();
  await page.getByLabel("Password").fill("e2e-admin-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText("AI Product Description")).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
});
