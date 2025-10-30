import { test, expect } from '@playwright/test'

test.describe('MDReader Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/MDReader/)
  })

  test('loads main navigation elements', async ({ page }) => {
    // Logo
    await expect(page.locator('h1')).toContainText('MDReader')
    
    // Navigation buttons
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('button:has-text("Login")')).toBeVisible()
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible()
  })

  test('hero section displays correctly', async ({ page }) => {
    // Main heading
    await expect(page.locator('h1')).toContainText('AI-First Markdown')
    await expect(page.locator('h1')).toContainText('Knowledge Management')
    
    // Hero description
    await expect(page.locator('p')).toContainText('Organize, visualize, and collaborate')
    
    // CTA buttons
    await expect(page.locator('a:has-text("Start Free Trial")')).toBeVisible()
    await expect(page.locator('a:has-text("View Features")')).toBeVisible()
  })

  test('features section renders all cards', async ({ page }) => {
    // Scroll to features
    await page.locator('#features').scrollIntoViewIfNeeded()
    
    // Check for all feature cards
    const features = [
      'AI-Powered Categorization',
      'Semantic Search',
      'Knowledge Graphs',
      'Real-time Collaboration',
      'Lightning Fast',
      'Privacy First',
    ]
    
    for (const feature of features) {
      await expect(page.locator(`h3:has-text("${feature}")`)).toBeVisible()
    }
  })

  test('navigation links work correctly', async ({ page }) => {
    // Test Get Started button
    const getStartedButton = page.locator('button:has-text("Get Started")')
    await getStartedButton.click()
    await expect(page).toHaveURL(/\/signup/)
    
    // Go back
    await page.goBack()
    
    // Test Login button
    const loginButton = page.locator('button:has-text("Login")')
    await loginButton.click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('skip link functionality for accessibility', async ({ page }) => {
    // Focus on skip link
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    
    // Press Enter to skip to main content
    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('responsive design on mobile', async ({ page }) => {
    // Emulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile layout
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('h1')).toContainText('MDReader')
    
    // Hero section should be readable on mobile
    await expect(page.locator('h1:has-text("AI-First Markdown")')).toBeVisible()
    
    // Features should stack vertically
    const featureCards = page.locator('.grid > div')
    await expect(featureCards.first()).toBeVisible()
  })
})
