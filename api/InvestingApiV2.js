const puppeteer = require('puppeteer');
const BrowserInterface = require('./BrowserInterface');
const InvestingInterface = require('./InvestingInterface');

class InvestingApiV2 {
  __browser;
  __page;

  async init(puppeteerLaunchOptions = {}, userAgent = BrowserInterface.USER_AGENT) {
    console.info('[InvestingApiV2/init] starting InvestingApiV2 (using puppeteer)...');
    puppeteerLaunchOptions = { ...puppeteerLaunchOptions, headless: 'new' };
    this.__browser = await puppeteer.launch(puppeteerLaunchOptions);
    this.__page = await this.__browser.newPage();
    await this.__page.setUserAgent(userAgent);
    console.info('[InvestingApiV2/init] started InvestingApiV2 (using puppeteer).');
  }

  async investing(input, period = 'P1M', interval = 'P1D', pointsCount = 120) {
    try {
      console.info(`[InvestingApiV2/investing] getting input [input='${input}', period=${period}, interval=${interval}, pointsCount=${pointsCount}]...`);
      this.__checkParams(input, period, interval, pointsCount);
      const pairId = InvestingInterface.MAPPING[input]?.pairId || input;
      const { data } = await this.__callInvesting(pairId, period, interval, pointsCount);
      const results = BrowserInterface.mapResponse(data);
      if (!results.length) {
        throw new Error('Wrong input or pairId');
      }
      console.info(`[InvestingApiV2/investing] getting input success ${JSON.stringify(results)}.`);
      return results;
    } catch (err) {
      console.error(`[InvestingApiV2/investing] error message = ${err.message}.`);
      if (err.response?.data?.['@errors']?.[0]) {
        console.error(`[InvestingApiV2/investing] error detail = ${err.response.data['@errors'][0]}.`);
      }
    }
  }

  close() {
    console.info(`[InvestingApiV2/investing] closing InvestingApiV2 (using puppeteer)...`);
    this.__browser.close();
    this.__page = undefined;
    this.__browser = undefined;
    console.info(`[InvestingApiV2/investing] closed InvestingApiV2 (using puppeteer).`);
  }

  async __callInvesting(pairId, period, interval, pointsCount) {
    await this.__page.goto(`https://api.investing.com/api/financialdata/${pairId}/historical/chart?period=${period}&interval=${interval}&pointscount=${pointsCount}`);
    return await BrowserInterface.getJsonContent(this.__page);
  }

  __checkParams(input, period, interval, pointsCount) {
    if (!input) {
      throw Error('Parameter input is required');
    }
    if (!InvestingInterface.VALID_PERIOD.includes(period)) {
      throw Error('Invalid period parameter. Valid values are: P1D, P1W, P1M, P3M, P6M, P1Y, P5Y, MAX');
    }
    if (!InvestingInterface.VALID_INTERVAL.includes(interval)) {
      throw Error('Invalid interval parameter. Valid values are: PT1M, PT5M, PT15M, PT30M, PT1H, PT5H, P1D, P1W, P1M');
    }
    if (!InvestingInterface.VALID_POINTS_COUNT.includes(pointsCount)) {
      throw Error('Invalid pointsCount parameter. Valid values are: 60, 70, 120');
    }
  }
}

module.exports = new InvestingApiV2;
