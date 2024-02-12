class BrowserInterface {
  static USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36';

  /**
   * Map the Investing array response
   * @param {Array} array Array of data returned from Investing website
   * @return {Array} An array of objects with date and value properties
   */
  static mapResponse(array = []) {
    return array.map((item) => ({
      date: item[0], // date
      value: item[1], // open
      price_open: item[1],
      price_high: item[2],
      price_low: item[3],
      price_close: item[4],
    }));
  }

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

module.exports = BrowserInterface;
