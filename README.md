# Investing.com Unofficial APIs V2 (no longer supported)
[![NPM](https://nodei.co/npm/investing-com-api-v2.png)](https://nodei.co/npm/investing-com-api-v2/)

### Introduction
**This version is no longer supported.**  
Unofficial APIs for Investing.com website.  
Upgraded from [investing-com-api](https://github.com/DavideViolante/investing-com-api), fixes RAM overflow error when hanging for a long time on windows server.  
`investing-api-java` for JAVA project (long term support), [see here](https://github.com/PhamHuyThien/investing-api-java)

### Install
`npm i investing-com-api-v2`

### Example
```javascript
const InVestingApiV2 = require('investing-com-api-v2/api/InvestingApiV2');
//default using console, can use winston...
InVestingApiV2.logger(console);
//enable debugger
InVestingApiV2.setDebugger(false);
//startup browser
//function init(pptrLaunchOptions:LaunchOptions):Promise<void>;
await InVestingApiV2.init({});
//get data
/*
function investing(
  input: string,
  period?: 'P1D' | 'P1W' | 'P1M' | 'P3M' | 'P6M' | 'P1Y' | 'P5Y' | 'MAX',
  interval?: 'PT1M' | 'PT5M' | 'PT15M' | 'PT30M' | 'PT1H' | 'PT5H' | 'P1D' | 'P1W' | 'P1M',
  pointscount?: 60 | 70 | 120
): Promise<{
    date: number,
    value: number,
    price_open: number,
    price_high: number,
    price_low: number,
    price_close: number,
  }[]>
*/
let data = await InVestingApiV2.investing(
  'currencies/eur-usd',
  'P1D',
  'PT1M',
  60);
console.log(data);
//close browser
//function close():Promise<void>;
await InVestingApiV2.close();
```

### Inputs
Only input is required, other params are optional.
- **input** _String_: input string, see [mapping.js](https://github.com/PhamHuyThien/investing-com-api-v2/blob/master/api/InvestingService.js) keys, **or provide a valid investing.com pairId**. (Required)
- **period** _String_: Period of time, window size. Default P1M (1 month). Valid values: P1D, P1W, P1M, P3M, P6M, P1Y, P5Y, MAX.
- **interval** _Number_: Interval between results. Default P1D (1 day). Valid values: PT1M, PT5M, PT15M, PT30M, PT1H, PT5H, P1D, P1W, P1M.
- **pointsCount** _Number_: number of total results. Valid values seems to be 60, 70 or 120.
- **puppeteerLaunchOptions** _Any_: Puppeteer launch options, see [official website](https://pptr.dev/api/puppeteer.launchoptions).

### How to get pairId?

- step 1: visit [this link](https://www.investing.com/) and search for the pair you want to get pairId.
- step 2: See image instructions below
  ![How to get pairId](https://i.imgur.com/2FFngFy.png)

### Author
- [Pham Huy Thien](https://github.com/PhamHuyThien/)
