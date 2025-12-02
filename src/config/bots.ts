export type FlowName = 'login'|'quote_check'|'report_download'|'purchase_execution';

export interface BotDefinition {
    id:number;
    name:string;
    defaultFlow:FlowName;
    enabled:boolean;
}

export const BOTS: BotDefinition[] = [
    {
        id: 1,
        name: 'Bot 1',
        defaultFlow: 'login',
        enabled: true,
    },
    {
        id: 2,
        name: 'Bot 2',
        defaultFlow: 'quote_check',
        enabled: true,
    },
    {
        id: 3,
        name: 'Bot 3',
        defaultFlow: 'report_download',
        enabled: true,
    },
    {
        id: 4,
        name: 'Bot 4',
        defaultFlow: 'purchase_execution',
        enabled: true,
    },
];