import { test, expect } from '@playwright/test';

test.describe('Meetings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/meetings');
    await page.waitForLoadState('networkidle');
  });

  test('should display meetings page with title and create button', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Meetings' })).toBeVisible();
    await expect(page.getByText('Manage and schedule your meetings')).toBeVisible();
    await expect(page.getByRole('button', { name: /create meeting/i })).toBeVisible();
  });

  test('should display initial mock meetings', async ({ page }) => {
    await expect(page.getByText('Team Standup')).toBeVisible();
    await expect(page.getByText('Project Review')).toBeVisible();
    await expect(page.getByText('Client Presentation')).toBeVisible();
  });

  test('should open create meeting form when clicking create button', async ({ page }) => {
    await page.getByRole('button', { name: /\+ create meeting/i }).click();
    
    await expect(page.getByText('Create New Meeting')).toBeVisible();
    await expect(page.getByLabel(/meeting title/i)).toBeVisible();
  });

  test('should create a new meeting successfully', async ({ page }) => {
    // Open form
    await page.getByRole('button', { name: /\+ create meeting/i }).click();
    
    // Fill form
    await page.getByLabel(/meeting title/i).fill('Playwright Test Meeting');
    await page.getByLabel(/description/i).fill('Created by automated test');
    await page.getByLabel(/start time/i).fill('2025-10-27T10:00');
    await page.getByLabel(/end time/i).fill('2025-10-27T11:00');
    await page.locator('input[name="room"]').fill('Test Room');
    
    // Submit
    await page.getByRole('button', { name: /^create meeting$/i }).click();
    
    // Verify success
    await expect(page.getByText(/meeting created successfully/i)).toBeVisible();
    await expect(page.getByText('Playwright Test Meeting')).toBeVisible();
  });

  test('should search meetings by title', async ({ page }) => {
    // Type in search box
    const searchInput = page.getByPlaceholder(/search meetings/i);
    await searchInput.fill('Team');
    
    // Verify filtered results
    await expect(page.getByText('Team Standup')).toBeVisible();
    await expect(page.getByText(/showing.*of.*meetings/i)).toBeVisible();
  });

  test('should filter meetings by status', async ({ page }) => {
    // Click status filter dropdown
    await page.locator('[role="combobox"]').first().click();
    
    // Select "Scheduled"
    await page.getByRole('option', { name: /scheduled/i }).click();
    
    // Verify all visible meetings are scheduled
    await expect(page.getByText('scheduled').first()).toBeVisible();
  });

  test('should show empty state when no results match search', async ({ page }) => {
    // Search for non-existent meeting
    const searchInput = page.getByPlaceholder(/search meetings/i);
    await searchInput.fill('NonExistentMeeting12345');
    
    // Verify empty state
    await expect(page.getByText('No meetings found')).toBeVisible();
    await expect(page.getByText('Try adjusting your search or filters')).toBeVisible();
  });

  test('should clear filters and show all meetings', async ({ page }) => {
    // Apply search filter
    const searchInput = page.getByPlaceholder(/search meetings/i);
    await searchInput.fill('NonExistent');
    
    // Wait for empty state
    await expect(page.getByText('No meetings found')).toBeVisible();
    
    // Click clear filters
    await page.getByRole('button', { name: /clear filters/i }).click();
    
    // Verify all meetings are shown again
    await expect(page.getByText('Team Standup')).toBeVisible();
  });

  test('should edit a meeting', async ({ page }) => {
    // Click edit button on first meeting
    await page.getByRole('button', { name: /edit/i }).first().click();
    
    // Verify edit form opens
    await expect(page.getByText('Edit Meeting')).toBeVisible();
    
    // Update title
    const titleInput = page.getByLabel(/meeting title/i);
    await titleInput.clear();
    await titleInput.fill('Updated Team Standup');
    
    // Submit
    await page.getByRole('button', { name: /update meeting/i }).click();
    
    // Verify success
    await expect(page.getByText(/meeting updated successfully/i)).toBeVisible();
    await expect(page.getByText('Updated Team Standup')).toBeVisible();
  });

  test('should delete a meeting with confirmation', async ({ page }) => {
    // Set up dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete button
    await page.getByRole('button', { name: /delete/i }).first().click();
    
    // Verify success toast
    await expect(page.getByText(/meeting deleted/i)).toBeVisible();
  });

  test('should cancel delete when confirmation is declined', async ({ page }) => {
    // Set up dialog handler to decline
    page.on('dialog', dialog => dialog.dismiss());
    
    // Count meetings before
    const meetingsBefore = await page.getByRole('heading', { level: 3 }).count();
    
    // Click delete button
    await page.getByRole('button', { name: /delete/i }).first().click();
    
    // Count meetings after
    const meetingsAfter = await page.getByRole('heading', { level: 3 }).count();
    
    // Verify count is the same
    expect(meetingsAfter).toBe(meetingsBefore);
  });

  test('should display meeting details correctly', async ({ page }) => {
    await expect(page.getByText('Daily team synchronization')).toBeVisible();
    await expect(page.getByText('Conference Room A')).toBeVisible();
    await expect(page.getByText(/5 participants/i)).toBeVisible();
  });

  test('should show meeting status badges', async ({ page }) => {
    const badges = page.locator('text=scheduled');
    await expect(badges.first()).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('button', { name: /create meeting/i })).toBeVisible();
      
      // Search should stack vertically
      await expect(page.getByPlaceholder(/search meetings/i)).toBeVisible();
    }
  });
});

test.describe('Meetings Page - Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/meetings');
    await page.waitForLoadState('networkidle');
  });

  test('should require title field', async ({ page }) => {
    await page.getByRole('button', { name: /\+ create meeting/i }).click();
    
    // Try to submit without title
    await page.getByRole('button', { name: /^create meeting$/i }).click();
    
    // Form should not close (validation error)
    await expect(page.getByText('Create New Meeting')).toBeVisible();
  });

  test('should close form when cancel is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /\+ create meeting/i }).click();
    
    await expect(page.getByText('Create New Meeting')).toBeVisible();
    
    // Click cancel in form
    await page.getByRole('button', { name: /cancel/i }).last().click();
    
    // Form should close
    await expect(page.getByText('Create New Meeting')).not.toBeVisible();
  });
});
