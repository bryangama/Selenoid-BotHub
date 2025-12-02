
import { WebDriver } from 'selenium-webdriver';
import { getDriver } from '../core/DriverFactory';
import { GooglePage } from '../pages/GooglePage';
import { GooglePage2 } from '../pages/GooglePage2';
import { GooglePage3 } from '../pages/GooglePage3';


export class BotRunner {
  constructor(private botId: number) {}

  async run(flowName: string): Promise<void> {
    let driver: WebDriver | null = null;

    const BotsExecucao = {
      quote_check: async () => {
        if (!driver) return;

        await new GooglePage(driver).run();
      },
      report_download: async () => {
        if (!driver) return;

        await new GooglePage2(driver).run();
      },
      purchase_execution: async () => {
        if (!driver) return;
        await new GooglePage3(driver).run();
      }
    }

    try {
      driver = await getDriver(this.botId);

      const execucao = BotsExecucao[flowName as keyof typeof BotsExecucao];

      if (!execucao) {
        console.error(`[BotRunner] Flow desconhecido: ${flowName}`);
        return;
      }

      await execucao();

    } finally {
      if (driver) {
        await driver.quit();
        console.log(`[BotRunner] Bot ${this.botId} finalizou e fechou o navegador.`);
      }
    }
  }
}
