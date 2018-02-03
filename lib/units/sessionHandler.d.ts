/// <reference types="express" />
import { RequestHandler } from 'express';
import { TSession } from './sessionInfo';
export declare class TOptions {
    cryptoSize: number;
    maxAge: number;
    appName: string;
    filename: string;
    constructor();
}
/** Session Manager App */
export declare class TSessionApp {
    private _options;
    private _sessions;
    constructor(options?: any);
    readonly Options: TOptions;
    /** get session handler middleware */
    readonly handler: RequestHandler;
    /** get session function */
    readonly session: any;
    /** create a logged session and returns session */
    createSession(req: any, res: any, data: any): TSession;
    /** destroy a logged session */
    destroySession(req: any, res: any): boolean;
    /** get session content */
    private _getSession(req, res);
    private _handler(req, res, next);
    /** get cookie or create it */
    private _getCookie(req, res, appName);
    /** find user */
    private _findSession(sessionid);
    private _saveSessionToFile(filename);
}
