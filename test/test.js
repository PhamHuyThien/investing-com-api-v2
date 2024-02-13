const InVestingApiV2 = require('../api/InvestingApiV2');

(async () => {
  //default using console, can use winston...
  InVestingApiV2.logger(console);
  //enable debugger
  InVestingApiV2.setDebugger(false);

  //startup browser
  await InVestingApiV2.init();

  //get data
  let data = await InVestingApiV2.investing(
      'currencies/eur-usd',
      'P1D',
      'PT1M',
      60);
  console.log(data);

  //close browser
  await InVestingApiV2.close();
})();
