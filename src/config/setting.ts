import 'dotenv/config';

export const USE_SELENOID: boolean = process.env.USE_SELENOID === 'true';

export const SELENOID_URL: string = process.env.SELENOID_URL ?? 'http://localhost:4444/wd/hub';
export const QTD_BOTS: number = Number(process.env.QTD_BOTS ?? 3); // Máximo de bots simultâneos

export const BROWSER_VERSION: string = process.env.BROWSER_VERSION ?? '124.0';
export const BROWSER_NAME: string = process.env.BROWSER_NAME ?? 'chrome';
