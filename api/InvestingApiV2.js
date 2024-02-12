const puppeteer = require('puppeteer');
const BrowserInterface = require('./BrowserInterface');
const InvestingInterface = require('./InvestingInterface');

class InvestingApiV2 {
  __browser;
  __logger = console;

  logger(logger) {
    this.__logger = logger;
  }

  async init(puppeteerLaunchOptions = {}) {
    this.__logger.info('[InvestingApiV2/init] starting InvestingApiV2 (using puppeteer)...');
    puppeteerLaunchOptions = { ...puppeteerLaunchOptions, headless: 'new' };
    this.__browser = await puppeteer.launch(puppeteerLaunchOptions);
    this.__logger.info('[InvestingApiV2/init] started InvestingApiV2 (using puppeteer).');
  }

  async investing(input, period = 'P1M', interval = 'P1D', pointsCount = 120) {
    try {
      this.__logger.info(`[InvestingApiV2/investing] getting input [input='${input}', period=${period}, interval=${interval}, pointsCount=${pointsCount}]...`);
      this.__checkParams(input, period, interval, pointsCount);
      let pairId = InvestingInterface.MAPPING[input]?.pairId || input;
      let currentTime = Date.now();
      let { data } = await this.__callInvesting(pairId, period, interval, pointsCount);
      let executeTime = Date.now() - currentTime;
      let results = BrowserInterface.mapResponse(data);
      this.__checkResponse(results);
      let totalPage = (await this.__browser.pages()).length;
      let responseLog = JSON.stringify(results);
      responseLog = responseLog.length > 50 ? responseLog.substring(0, 50) + '...' : responseLog;
      this.__logger.info(`[InvestingApiV2/investing] get success ${responseLog}. runtime ${executeTime} ms, ${totalPage} page running.`);
      return results;
    } catch (err) {
      this.__logger.error(`[InvestingApiV2/investing] error message = ${err.message}.`);
      if (err.response?.data?.['@errors']?.[0]) {
        this.__logger.error(`[InvestingApiV2/investing] error detail = ${err.response.data['@errors'][0]}.`);
      }
    }
  }

  async close() {
    this.__logger.info(`[InvestingApiV2/investing] closing InvestingApiV2 (using puppeteer)...`);
    await this.__browser.close();
    this.__browser = undefined;
    this.__logger.info(`[InvestingApiV2/investing] closed InvestingApiV2 (using puppeteer).`);
  }

  async __callInvesting(pairId, period, interval, pointsCount) {
    let page = await this.__browser.newPage();
    await page.setUserAgent(BrowserInterface.USER_AGENT);
    await page.goto(`https://api.investing.com/api/financialdata/${pairId}/historical/chart?period=${period}&interval=${interval}&pointscount=${pointsCount}`);
    let response = await BrowserInterface.getJsonContent(page);
    await page.close();
    return response;
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

  __checkResponse(data) {
    if (!data.length) {
      throw new Error('Wrong input or pairId');
    }
  }
}

module.exports = new InvestingApiV2;
