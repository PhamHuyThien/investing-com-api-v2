const InVestingApiV2 = require('../api/InvestingApiV2');

(async () => {
  InVestingApiV2.logger(console);
  await InVestingApiV2.init();
  await InVestingApiV2.investing(
    'currencies/eur-usd',
    'P1D',
    'PT1M',
    60);
  InVestingApiV2.close();
})();
