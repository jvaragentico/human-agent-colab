import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir:"./tests/e2e", timeout:60000,
  use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||"http://localhost:3000",trace:"retain-on-failure"},
  projects:[{name:"desktop",use:{...devices["Desktop Chrome"]}},{name:"mobile",use:{...devices["iPhone 13"],defaultBrowserType:"chromium"}}],
  webServer:process.env.PLAYWRIGHT_BASE_URL?undefined:{command:"npm run start",url:"http://localhost:3000",reuseExistingServer:!process.env.CI},
  reporter:[["list"]]
});

