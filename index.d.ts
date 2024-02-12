declare module "investing-com-api-v2" {
    export class InvestingApiV2 {
        init(
            puppeteerLaunchOptions: any,
            userAgent: string
        ): void;

        investing(
            input: string,
            period?: 'P1D' | 'P1W' | 'P1M' | 'P3M' | 'P6M' | 'P1Y' | 'P5Y' | 'MAX',
            interval?: 'PT1M' | 'PT5M' | 'PT15M' | 'PT30M' | 'PT1H' | 'PT5H' | 'P1D' | 'P1W' | 'P1M',
            pointsCount?: 60 | 70 | 120,
        ): Promise<{
            date: number,
            value: number,
            price_open: number,
            price_high: number,
            price_low: number,
            price_close: number,
        }[]>;
    }
}

