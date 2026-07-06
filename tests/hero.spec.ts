import { test, expect } from '@playwright/test';

test.describe('Mobile Hero QA', () => {
  const viewports = [
    { width: 320, height: 600, name: '320px' },
    { width: 375, height: 667, name: '375px' },
    { width: 1440, height: 900, name: '1440px' }
  ];

  for (const vp of viewports) {
    test(`Viewport ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:3000');

      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();

      // 1. Text Truncation Check
      const heading = hero.locator('h1');
      await expect(heading).toContainText('Bikin website & aplikasi untuk bisnis kamu — tanpa pusing teknis');
      
      // 2. Button Alignment
      const buttonContainer = hero.locator('div.flex.flex-col.gap-3');
      const flexDirection = await buttonContainer.evaluate((el) => window.getComputedStyle(el).flexDirection);
      if (vp.width < 640) {
        expect(flexDirection).toBe('column');
      } else {
        expect(flexDirection).toBe('row');
      }

      // 3. Image Sizing
      const imageWrapper = hero.locator('div.editorial-shadow');
      const boundingBox = await imageWrapper.boundingBox();
      expect(boundingBox).not.toBeNull();
      // Ensure image width isn't excessively dominating (less than viewport if mobile)
      if (vp.width < 640) {
        expect(boundingBox!.width).toBeLessThanOrEqual(vp.width);
      }

      // 4. Typography Hierarchy (Eyebrow < Headline < Subtext)
      const eyebrow = await hero.locator('p').first().evaluate((el) => parseFloat(window.getComputedStyle(el).fontSize));
      const headline = await heading.evaluate((el) => parseFloat(window.getComputedStyle(el).fontSize));
      const subtext = await hero.locator('p').nth(1).evaluate((el) => parseFloat(window.getComputedStyle(el).fontSize));
      
      expect(eyebrow).toBeLessThan(headline);
      expect(subtext).toBeLessThan(headline);

      await page.screenshot({ path: `hero-${vp.name}.png` });
    });
  }
});
