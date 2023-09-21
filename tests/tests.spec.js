// @ts-check
const { test, expect } = require('@playwright/test');
const { timeout } = require('../playwright.config');
let testCases = [
  {
    "id": 1,
    "name": "Test Case 1",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To Do",
    "card_title": "Draft project brief",
    "tags": ["Low", "On track"]
  },
  {
    "id": 2,
    "name": "Test Case 2",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To Do",
    "card_title": "Schedule kickoff meeting",
    "tags": ["Medium", "At risk"]
  },
  {
    "id": 3,
    "name": "Test Case 3",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To Do",
    "card_title": "Share timeline with teammates",
    "tags": ["High", "Off track"]
  },
  {
    "id": 4,
    "name": "Test Case 4",
    "leftNav": "Work Requests",
    "column": "New Requests",
    "card_title": "[Example] Laptop setup for new hire",
    "tags": ["Medium priority", "Low effort", "New hardware", "Not Started"]
  },
  {
    "id": 5,
    "name": "Test Case 5",
    "leftNav": "Work Requests",
    "column": "In Progress",
    "card_title": "[Example] Password not working",
    "tags": ["Low priority", "Low effort", "Password reset", "Waiting"]
  },
  {
    "id": 6,
    "name": "Test Case 6",
    "leftNav": "Work Requests",
    "column": "Completed",
    "card_title": "[Example] New keycard for Daniela V",
    "tags": ["High priority", "Low effort", "New hardware", "Done"]
  }
];

testCases.forEach(testCase =>{

  test(`${testCase.name}`, async ({ page }) => {
    const column = await page.locator(`.BoardColumn:has(h3:text("${testCase.column}"))`);
    const cardInColumn = await column.locator(`.BoardCardLayout:has(span:text("${testCase.card_title}"))`);

    await test.step("Login", async () => {
      await page.goto('https://app.asana.com/-/login');
      await page.fill('input[type="text"]', "ben+pose@workwithloop.com");
      await page.click(".LoginEmailForm-continueButton");
      await page.getByLabel('Password', { exact: true }).fill("Password123");
      await page.click(".LoginPasswordForm-loginButton");

      await expect(page.locator(".HomePageContent-greeting")).toBeVisible();
    });

    await test.step(`Navigate to ${testCase.leftNav}`, async () =>{
      try{
        await page.click(`[aria-label="${testCase.leftNav}"]`, {timeout: 5000});
      }catch{
        await page.click(`:text("${testCase.leftNav}") >> nth=-1`);
      }
    });

    await test.step(`Assert the ${testCase.card_title} card is in the ${testCase.column} column`, async () => {
      await expect(cardInColumn).toHaveCount(1);
    });

    await test.step(`Assert the card has the correct tags`, async () =>{
      const tagLocators = await cardInColumn.locator('.BoardCardCustomPropertiesAndTags > div');
      for (const tagLocator of await tagLocators.elementHandles()){
        const tagText = await tagLocator.innerText();
        console.log(tagText + "--------");
        await expect(testCase["tags"].includes(tagText)).toBe(true);
      }

      await expect(tagLocators).toHaveCount(testCase["tags"].length);
    });

  });
});
