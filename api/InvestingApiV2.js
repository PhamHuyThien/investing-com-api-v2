const puppeteer = require('puppeteer');
const BrowserService = require('./BrowserService');
const InvestingService = require('./InvestingService');

class InvestingApiV2 {
  __browser;
  __logger = console;
  __debugger = true;
  __intervalAutoClose;

  setDebugger(status) {
    this.__debugger = status;
  }
  logger(logger) {
    this.__logger = logger;
  }

  async init(puppeteerLaunchOptions = {}) {
    this.__writeLog('info', '[InvestingApiV2/init] starting InvestingApiV2 (using puppeteer)...');
    puppeteerLaunchOptions = { ...puppeteerLaunchOptions, headless: 'new' };
    this.__browser = await puppeteer.launch(puppeteerLaunchOptions);
    this.__writeLog('info', '[InvestingApiV2/init] started InvestingApiV2 (using puppeteer).');
  }

  async investing(input, period = 'P1M', interval = 'P1D', pointsCount = 120) {
    try {
      if (!this.__browser) {
        await this.init();
      }
      this.__writeLog('info', `[InvestingApiV2/investing] getting input [input='${input}', period=${period}, interval=${interval}, pointsCount=${pointsCount}]...`);
      this.__checkParams(input, period, interval, pointsCount);
      let pairId = InvestingService.MAPPING[input]?.pairId || input;
      let currentTime = Date.now();
      let { data } = await this.__callInvesting(pairId, period, interval, pointsCount);
      let executeTime = Date.now() - currentTime;
      let results = InvestingService.mapResponse(data);
      this.__checkResponse(results);
      let responseLog = JSON.stringify(results);
      responseLog = responseLog.length > 50 ? responseLog.substring(0, 50) + '...' : responseLog;
      this.__writeLog('info', `[InvestingApiV2/investing] get success ${responseLog}. runtime ${executeTime} ms.`);
      return results;
    } catch (err) {
      this.__writeLog('error', `[InvestingApiV2/investing] error message = ${err.message}.`);
      if (err.response?.data?.['@errors']?.[0]) {
        this.__writeLog('error', `[InvestingApiV2/investing] error detail = ${err.response.data['@errors'][0]}.`);
      }
    }
  }

  async close() {
    this.__writeLog('info', `[InvestingApiV2/close] closing InvestingApiV2 (using puppeteer)...`);
    await this.__browser.close();
    this.__browser = undefined;
    this.__writeLog('info', `[InvestingApiV2/close] closed InvestingApiV2 (using puppeteer).`);
  }

  autoClose(maxPage = 20, intervalTime = 1000, timeRestart = 0, processExit = true) {
    const __this = this;
    this.__writeLog('info', `[InvestingApiV2/autoClose] enabled auto close max page ${maxPage}, interval ${intervalTime}, timeRestart ${timeRestart}`);
    this.__intervalAutoClose = setInterval(async function() {
      if (__this.__browser) {
        let totalPage = (await __this.__browser.pages()).length;
        __this.__writeLog('info', `[InvestingApiV2/autoClose] total page running ${totalPage}, max page ${maxPage}.`);
        if (totalPage >= maxPage) {
          __this.__writeLog('warn', `[InvestingApiV2/autoClose] max page > total page, shutdown in ${timeRestart} using processExit ${processExit}`);
          setTimeout(function() {
            if (processExit) {
              process.exit(0);
            } else {
              __this.close();
            }
          }, timeRestart);
        }
      }
    }, intervalTime);
  }

  async clearAutoClose() {
    this.__writeLog('info', `[InvestingApiV2/clearAutoClose] disabled auto close successfully`);
    if (this.__intervalAutoClose) clearInterval(this.__intervalAutoClose);
  }

  async __callInvesting(pairId, period, interval, pointsCount) {
    let page = await this.__browser.newPage();
    await page.setUserAgent(BrowserService.USER_AGENT);
    await page.goto(`https://api.investing.com/api/financialdata/${pairId}/historical/chart?period=${period}&interval=${interval}&pointscount=${pointsCount}`);
    let response = await BrowserService.getJsonContent(page);
    await page.close();
    return response;
  }

  __checkParams(input, period, interval, pointsCount) {
    if (!input) {
      throw Error('Parameter input is required');
    }
    if (!InvestingService.VALID_PERIOD.includes(period)) {
      throw Error('Invalid period parameter. Valid values are: P1D, P1W, P1M, P3M, P6M, P1Y, P5Y, MAX');
    }
    if (!InvestingService.VALID_INTERVAL.includes(interval)) {
      throw Error('Invalid interval parameter. Valid values are: PT1M, PT5M, PT15M, PT30M, PT1H, PT5H, P1D, P1W, P1M');
    }
    if (!InvestingService.VALID_POINTS_COUNT.includes(pointsCount)) {
      throw Error('Invalid pointsCount parameter. Valid values are: 60, 70, 120');
    }
  }

  __checkResponse(data) {
    if (!data.length) {
      throw new Error('Wrong input or pairId');
    }
  }

  __writeLog(type, data) {
    if (this.__debugger) {
      this.__logger[type](data);
    }
  }
}

module.exports = new InvestingApiV2;
