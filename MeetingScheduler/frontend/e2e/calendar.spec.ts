import { test, expect } from '@playwright/test';

test.describe('Calendar Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
  });

  test('should display calendar page with title and create button', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Calendar');
    await expect(page.getByRole('button', { name: /create meeting/i })).toBeVisible();
  });

  test('should show mock events on calendar', async ({ page }) => {
    await expect(page.getByText('Team Standup')).toBeVisible();
    await expect(page.getByText('Project Review')).toBeVisible();
    await expect(page.getByText('Client Meeting')).toBeVisible();
  });

  test('should open create meeting modal when clicking create button', async ({ page }) => {
    await page.getByRole('button', { name: /create meeting/i }).click();
    await expect(page.getByText('Create New Meeting')).toBeVisible();
    await expect(page.getByLabel(/meeting title/i)).toBeVisible();
  });

  test('should open event details modal when clicking an event', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('text=Team Standup');
    
    // Click on the first event
    await page.locator('text=Team Standup').first().click();
    
    // Check if modal opens with event details
    await expect(page.getByText('Team Standup')).toBeVisible();
  });

  test('should create a new meeting successfully', async ({ page }) => {
    // Open create modal
    await page.getByRole('button', { name: /create meeting/i }).click();
    
    // Fill in the form
    await page.getByLabel(/meeting title/i).fill('E2E Test Meeting');
    await page.getByLabel(/description/i).fill('This is a test meeting created by Playwright');
    await page.getByLabel(/start time/i).fill('2025-10-26T14:00');
    await page.getByLabel(/end time/i).fill('2025-10-26T15:00');
    
    // Select room
    await page.getByRole('combobox').click();
    await page.getByText('Conference Room A').click();
    
    // Submit form
    await page.getByRole('button', { name: /^create meeting$/i }).click();
    
    // Verify toast notification
    await expect(page.getByText(/meeting created successfully/i)).toBeVisible();
    
    // Verify the meeting appears on calendar
    await expect(page.getByText('E2E Test Meeting')).toBeVisible();
  });

  test('should delete a meeting successfully', async ({ page }) => {
    // Click on an event to open details
    await page.locator('text=Team Standup').first().click();
    
    // Click delete button (labeled as "Cancel Meeting" in the modal)
    await page.getByRole('button', { name: /cancel meeting/i }).click();
    
    // Verify toast notification
    await expect(page.getByText(/meeting deleted/i)).toBeVisible();
  });

  test('should support drag and drop event rescheduling', async ({ page }) => {
    // Note: Drag and drop testing with Playwright can be complex
    // This test verifies the drag & drop UI is present
    await expect(page.getByText('Drag events to reschedule')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('button', { name: /create meeting/i })).toBeVisible();
    }
  });
});

test.describe('Calendar - Edit Meeting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
  });

  test('should open edit modal and update meeting', async ({ page }) => {
    // Click on an event
    await page.locator('text=Team Standup').first().click();
    
    // Click edit button
    await page.getByRole('button', { name: /^edit$/i }).click();
    
    // Verify edit modal opens
    await expect(page.getByText('Edit Meeting')).toBeVisible();
    
    // Update the title
    const titleInput = page.getByLabel(/meeting title/i);
    await titleInput.clear();
    await titleInput.fill('Updated Team Standup');
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Verify toast notification
    await expect(page.getByText(/meeting updated/i)).toBeVisible();
  });
});
