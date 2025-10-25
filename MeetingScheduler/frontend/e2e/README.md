# Playwright E2E Tests

This directory contains end-to-end tests for the Meeting Scheduler application using Playwright.

## Test Coverage

### Calendar Tests (`calendar.spec.ts`)
- ✅ Display calendar page with title and create button
- ✅ Show mock events on calendar
- ✅ Open create meeting modal
- ✅ Open event details modal
- ✅ Create new meeting successfully
- ✅ Delete meeting successfully
- ✅ Support drag and drop UI
- ✅ Responsive design on mobile
- ✅ Edit meeting functionality

### Meetings Tests (`meetings.spec.ts`)
- ✅ Display meetings page with title and create button
- ✅ Display initial mock meetings
- ✅ Open create meeting form
- ✅ Create new meeting successfully
- ✅ Search meetings by title
- ✅ Filter meetings by status
- ✅ Show empty state when no results match
- ✅ Clear filters and show all meetings
- ✅ Edit meeting
- ✅ Delete meeting with confirmation
- ✅ Cancel delete when confirmation is declined
- ✅ Display meeting details correctly
- ✅ Show meeting status badges
- ✅ Responsive on mobile
- ✅ Form validation
- ✅ Close form when cancel is clicked

### Rooms Tests (`rooms.spec.ts`)
- ✅ Display rooms page with title and statistics
- ✅ Display initial room cards
- ✅ Show room details correctly
- ✅ Search rooms by name
- ✅ Search rooms by location
- ✅ Search rooms by equipment
- ✅ Filter rooms by availability
- ✅ Filter rooms by capacity (small/medium/large)
- ✅ Combine search and filters
- ✅ Show empty state when no rooms match
- ✅ Clear filters and show all rooms
- ✅ Open booking modal
- ✅ Close booking modal
- ✅ Submit booking successfully
- ✅ Update statistics dynamically
- ✅ Display room equipment list
- ✅ Responsive on mobile
- ✅ Accessibility tests

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### View test report
```bash
npm run test:e2e:report
```

### Run specific test file
```bash
npx playwright test calendar.spec.ts
```

### Run specific test by name
```bash
npx playwright test -g "should create a new meeting"
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

Tests are configured in `playwright.config.ts` with:
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- **Base URL**: http://localhost:3000
- **Auto-start dev server**: Configured to start Next.js dev server automatically
- **Trace**: On first retry (for debugging)
- **Screenshots**: On failure only
- **Parallel execution**: Enabled for faster test runs

## Test Results Summary

**Total Tests**: 235 (across all browsers/viewports)
**Passing**: 147 (62.5%)
**Failing**: 88 (37.5%)

### Known Issues

1. **Calendar mock data not loading consistently** - Some tests fail because mock events don't appear on calendar in certain browsers
2. **Radix UI Select components on mobile** - Hidden `<select>` elements in custom dropdowns cause timeout issues
3. **Strict mode violations** - Some elements appear multiple times (e.g., in toast notifications and page content)

### Browser Compatibility

| Browser | Pass Rate | Notes |
|---------|-----------|-------|
| Chromium | ~60% | Best compatibility, some mock data issues |
| Firefox | ~60% | Similar to Chromium |
| WebKit | ~58% | Additional search/filter issues |
| Mobile Chrome | ~62% | Select element timeout issues |
| Mobile Safari | ~55% | Most failures due to select elements |

## Debugging Tests

### View trace for failed test
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Debug specific test
```bash
npx playwright test --debug calendar.spec.ts
```

### Take screenshots during test
Screenshots are automatically saved to `test-results/` on failure.

## Writing New Tests

### Basic test structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Your test code
    await expect(page.getByText('Expected Text')).toBeVisible();
  });
});
```

### Locator best practices
- Use `page.getByRole()` for accessible elements
- Use `page.getByLabel()` for form fields
- Use `page.getByText()` for text content
- Avoid CSS selectors when possible

### Waiting strategies
- `waitForLoadState('networkidle')` - Wait for network to be idle
- `waitForSelector()` - Wait for element to appear
- Built-in auto-waiting in most Playwright actions

## CI/CD Integration

To run in CI/CD pipelines:
```bash
# Install browsers in CI
npx playwright install --with-deps

# Run tests
npm run test:e2e
```

## Troubleshooting

### Dev server not starting
If tests fail because dev server won't start, check:
- Port 3000 is not already in use
- Dependencies are installed (`npm install`)
- Build is working (`npm run build`)

### Tests timing out
Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60000, // 60 seconds instead of 30
```

### Flaky tests
Add explicit waits:
```typescript
await page.waitForTimeout(500); // Wait 500ms
await page.waitForSelector('text=Expected Text');
```
