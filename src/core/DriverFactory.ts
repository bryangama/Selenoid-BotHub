
import { Builder, WebDriver } from 'selenium-webdriver';
// @ts-ignore: Ignore type errors for missing chromedriver types
import chrome from 'selenium-webdriver/chrome';
import { 
    USE_SELENOID, 
    SELENOID_URL,
    QTD_BOTS, 
    BROWSER_NAME,
    BROWSER_VERSION
} from '../config/setting';

/**
 * Cria e retorna uma instância do WebDriver (Local ou Remota),
 * baseado na variável de ambiente USE_SELENOID.
 */
export async function getDriver(botId: number): Promise<WebDriver> {
    
    // --- Configuração Base para Chrome ---
    const options = new chrome.Options();
    
 

    if (USE_SELENOID) {
        // --- MODO SELENOID (REMOTO) ---

        // Configurar opções do Selenoid
        options.setBrowserName(BROWSER_NAME);
        options.setBrowserVersion(BROWSER_VERSION); 

        // Configurar as capabilities específicas do Selenoid (VNC, Nome)
        options.set('selenoid:options', {
            enableVNC:  Boolean(process.env.ENABLE_VNC), // Mostra a tela  do Chrome VNC
            enableVideo: Boolean(process.env.ENABLE_VIDEO), // nao grava o video na pasta opt/selenoid/video
            name: `Bot #${botId}`,
        });

        console.log(`[Bot ${botId}] MODO REMOTO: Conectando ao Selenoid em ${SELENOID_URL}...`);
        
        //  Constrói o Driver Remoto
        return await new Builder()
            .usingServer(SELENOID_URL)
            .withCapabilities(options)
            .build();

    } else {
        // --- MODO LOCAL (DESENVOLVIMENTO) ---
        
        console.log(`[Bot ${botId}] MODO LOCAL: Criando driver local...`);

        //  Constrói o Driver Local
        return await new Builder()
            .forBrowser(BROWSER_NAME)
            .setChromeOptions(options)
            .build();
    }
}