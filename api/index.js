const puppeteer = require('puppeteer');
const BrowserInterface = require('api/BrowserInterface');
const InvestingInterface = require('api/InvestingInterface');

class InvestingApiV2 extends BrowserInterface, InvestingInterface {
  __browser;
  __page;

  async init(puppeteerLaunchOptions, userAgent = InvestingApiV2.USER_AGENT) {
    this.__browser = await puppeteer.launch(puppeteerLaunchOptions);
    this.__page = await browser.newPage();
    await this.__page.setUserAgent(userAgent);
  }

  async investing(input, period = 'P1M', interval = 'P1D', pointsCount = 120) {
    try {
      this.__checkParams(input, period, interval, pointsCount);
      const pairId = InvestingApiV2.MAPPING[input]?.pairId || input;
      const { data } = await this.__callInvesting(pairId, period, interval, pointsCount);
      const results = BrowserInterface.mapResponse(data);
      if (!results.length) {
        throw Error('Wrong input or pairId');
      }
      return results;
    } catch (err) {
      console.error(err.message);
      if (err.response?.data?.['@errors']?.[0]) {
        console.error(err.response.data['@errors'][0]);
      }
    }
  }

  async __callInvesting(pairId, period, interval, pointsCount) {
    await this.__page.goto(`https://api.investing.com/api/financialdata/${pairId}/historical/chart?period=${period}&interval=${interval}&pointscount=${pointsCount}`);
    return await BrowserInterface.getJsonContent(this.__page);
  }

  __checkParams(input, period, interval, pointsCount) {
    if (!input) {
      throw Error('Parameter input is required');
    }
    if (!InvestingApiV2.VALID_PERIOD.includes(period)) {
      throw Error('Invalid period parameter. Valid values are: P1D, P1W, P1M, P3M, P6M, P1Y, P5Y, MAX');
    }
    if (!InvestingApiV2.VALID_INTERVAL.includes(interval)) {
      throw Error('Invalid interval parameter. Valid values are: PT1M, PT5M, PT15M, PT30M, PT1H, PT5H, P1D, P1W, P1M');
    }
    if (!InvestingApiV2.VALID_POINTS_COUNT.includes(pointsCount)) {
      throw Error('Invalid pointsCount parameter. Valid values are: 60, 70, 120');
    }
  }
}

module.exports = new InvestingApiV2;
