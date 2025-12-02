// src/pages/GooglePage.ts
import { WebDriver, By } from 'selenium-webdriver';

export class GooglePage3 {
    private driver: WebDriver;
    private url: string = 'https://www.google.com';

    private searchInput = By.name('q');

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    public async open(): Promise<void> {
        await this.driver.get(this.url);
    }

    public async search(term: string): Promise<void> {
        const inputElement = await this.driver.findElement(this.searchInput);
        await inputElement.sendKeys(term);
        await inputElement.sendKeys('\n');
    }

    public async getTitle(): Promise<string> {
        return this.driver.getTitle();
    }

    // 👇 AQUI ENTRA O FLUXO PADRÃO
    public async run(): Promise<void> {
        await this.open();
        await this.search("exemplo busca GooglePage");
        const title = await this.getTitle();
        console.log("[GooglePage] Título da página:", title);
    }
}
