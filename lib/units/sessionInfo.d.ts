export declare class TSession {
    data: any;
    sessionid: string;
    tokenid: string;
    constructor(sessionid: string);
    clear(): void;
}
export declare class TSessions {
    private _list;
    constructor();
    add(sessionid: string): TSession;
    find(sessionid: string, tokenid?: string): TSession;
    save(filename: string): void;
    load(filename: string): void;
}
