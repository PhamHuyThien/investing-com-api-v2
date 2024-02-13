class BrowserService {
  static USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36';

  /**
   * Get JSON response from Investing APIs
   * @param {*} page puppeteer page
   * @return {Object} JSON response from Investing
   */
  static async getJsonContent(page) {
    // eslint-disable-next-line no-undef
    const content = await page.evaluate(() => document.querySelector('body').textContent);
    return JSON.parse(content);
  }
}

module.exports = BrowserService;
