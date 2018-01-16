/// <reference types="express" />
import { RequestHandler } from 'express';
import { TSession } from './sessionInfo';
/** Session Manager App */
export declare class TSessionApp {
    private _options;
    private _sessions;
    constructor(options?: any);
    /** get session handler middleware */
    readonly handler: RequestHandler;
    /** create a logged session and returns session */
    createSession(req: any, res: any, data: any): TSession;
    destroySession(req: any, res: any): boolean;
    private _handler(req, res, next);
    /** get cookie or create it */
    private _getCookie(req, res, appName);
    /** find user */
    private _findSession(sessionid);
    private _saveSessionToFile(filename);
}
