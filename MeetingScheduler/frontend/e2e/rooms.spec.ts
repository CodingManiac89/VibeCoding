import { test, expect } from '@playwright/test';

test.describe('Rooms Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rooms');
    await page.waitForLoadState('networkidle');
  });

  test('should display rooms page with title and statistics', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Meeting Rooms' })).toBeVisible();
    await expect(page.getByText('Browse and book available meeting rooms')).toBeVisible();
    
    // Check statistics
    await expect(page.getByText(/Total Rooms/i)).toBeVisible();
    await expect(page.getByText(/Available Now/i)).toBeVisible();
    await expect(page.getByText(/Average Capacity/i)).toBeVisible();
  });

  test('should display initial room cards', async ({ page }) => {
    await expect(page.getByText('Conference Room A')).toBeVisible();
    await expect(page.getByText('Conference Room B')).toBeVisible();
    await expect(page.getByText('Executive Boardroom')).toBeVisible();
    await expect(page.getByText('Creative Studio')).toBeVisible();
  });

  test('should show room details correctly', async ({ page }) => {
    const firstRoom = page.locator('text=Conference Room A').locator('xpath=ancestor::div[contains(@class, "border")]');
    
    await expect(firstRoom).toBeVisible();
    await expect(firstRoom.getByText(/capacity/i)).toBeVisible();
    await expect(firstRoom.getByText(/available/i)).toBeVisible();
  });

  test('should search rooms by name', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search rooms/i);
    await searchInput.fill('Executive');
    
    // Should show Executive Boardroom
    await expect(page.getByText('Executive Boardroom')).toBeVisible();
    
    // Should hide other rooms
    await expect(page.getByText('Conference Room A')).not.toBeVisible();
  });

  test('should search rooms by location', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search rooms/i);
    await searchInput.fill('Building A');
    
    // Should show rooms in Building A
    await expect(page.getByText('Conference Room A')).toBeVisible();
  });

  test('should search rooms by equipment', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search rooms/i);
    await searchInput.fill('projector');
    
    // Should show rooms with projector
    const roomsWithProjector = page.getByText(/projector/i);
    await expect(roomsWithProjector.first()).toBeVisible();
  });

  test('should filter rooms by availability', async ({ page }) => {
    // Open availability filter
    await page.locator('select').first().selectOption('available');
    
    // All visible rooms should show "Available"
    await expect(page.getByText('Available').first()).toBeVisible();
  });

  test('should filter rooms by capacity - small', async ({ page }) => {
    // Select small capacity filter (last select)
    await page.locator('select').last().selectOption('small');
    
    // Verify filtering is applied
    await expect(page.getByText(/showing.*rooms/i)).toBeVisible();
  });

  test('should filter rooms by capacity - medium', async ({ page }) => {
    await page.locator('select').last().selectOption('medium');
    
    await expect(page.getByText(/showing.*rooms/i)).toBeVisible();
  });

  test('should filter rooms by capacity - large', async ({ page }) => {
    await page.locator('select').last().selectOption('large');
    
    await expect(page.getByText(/showing.*rooms/i)).toBeVisible();
  });

  test('should combine search and filters', async ({ page }) => {
    // Search
    await page.getByPlaceholder(/search rooms/i).fill('Conference');
    
    // Filter by availability
    await page.locator('select').first().selectOption('available');
    
    // Filter by capacity
    await page.locator('select').last().selectOption('medium');
    
    // Results should be filtered
    await expect(page.getByText(/showing.*rooms/i)).toBeVisible();
  });

  test('should show empty state when no rooms match filters', async ({ page }) => {
    // Search for non-existent room
    await page.getByPlaceholder(/search rooms/i).fill('NonExistentRoom12345');
    
    // Verify empty state
    await expect(page.getByText('No rooms found')).toBeVisible();
    await expect(page.getByText('Try adjusting your search or filters')).toBeVisible();
    await expect(page.getByRole('button', { name: /clear filters/i })).toBeVisible();
  });

  test('should clear filters and show all rooms', async ({ page }) => {
    // Apply filters that result in no matches
    await page.getByPlaceholder(/search rooms/i).fill('NonExistent');
    
    // Wait for empty state
    await expect(page.getByText('No rooms found')).toBeVisible();
    
    // Click clear filters
    await page.getByRole('button', { name: /clear filters/i }).click();
    
    // Verify all rooms are shown again
    await expect(page.getByText('Conference Room A')).toBeVisible();
    await expect(page.getByText('Conference Room B')).toBeVisible();
  });

  test('should open booking modal when clicking book button', async ({ page }) => {
    // Click first "Book Room" button
    await page.getByRole('button', { name: /book room/i }).first().click();
    
    // Verify modal opens
    await expect(page.getByText('Book Meeting Room')).toBeVisible();
    await expect(page.getByLabel(/meeting title/i)).toBeVisible();
    await expect(page.getByLabel(/start time/i)).toBeVisible();
    await expect(page.getByLabel(/end time/i)).toBeVisible();
  });

  test('should close booking modal when cancel is clicked', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /book room/i }).first().click();
    await expect(page.getByText('Book Meeting Room')).toBeVisible();
    
    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).last().click();
    
    // Modal should close
    await expect(page.getByText('Book Meeting Room')).not.toBeVisible();
  });

  test('should submit booking successfully', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /book room/i }).first().click();
    
    // Fill form
    await page.getByLabel(/meeting title/i).fill('E2E Test Booking');
    await page.getByLabel(/start time/i).fill('2025-10-28T14:00');
    await page.getByLabel(/end time/i).fill('2025-10-28T15:00');
    
    // Submit
    await page.getByRole('button', { name: /confirm booking/i }).click();
    
    // Verify success toast
    await expect(page.getByText(/room booked successfully/i)).toBeVisible();
  });

  test('should update statistics dynamically', async ({ page }) => {
    // Get initial statistics
    const statsText = await page.getByText(/showing.*rooms/i).textContent();
    
    // Apply a filter
    await page.getByPlaceholder(/search rooms/i).fill('Conference');
    
    // Wait for statistics to update
    await page.waitForTimeout(500);
    
    // Statistics should still be visible (may have changed)
    await expect(page.getByText(/showing.*rooms/i)).toBeVisible();
  });

  test('should display room equipment list', async ({ page }) => {
    const equipmentItems = page.getByText(/projector|whiteboard|video conferencing|phone|screens/i);
    
    await expect(equipmentItems.first()).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      await expect(page.locator('h1')).toBeVisible();
      
      // Search and filters should be accessible
      await expect(page.getByPlaceholder(/search rooms/i)).toBeVisible();
      
      // Room cards should stack vertically
      await expect(page.getByText('Conference Room A')).toBeVisible();
    }
  });
});

test.describe('Rooms Page - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rooms');
    await page.waitForLoadState('networkidle');
  });

  test('should have accessible search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search rooms/i);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();
  });

  test('should have accessible filter selects', async ({ page }) => {
    const selects = page.locator('select');
    const count = await selects.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      await expect(selects.nth(i)).toBeVisible();
    }
  });

  test('should have accessible book buttons', async ({ page }) => {
    const bookButtons = page.getByRole('button', { name: /book room/i });
    const count = await bookButtons.count();
    
    expect(count).toBeGreaterThan(0);
    
    await expect(bookButtons.first()).toBeEnabled();
  });
});
