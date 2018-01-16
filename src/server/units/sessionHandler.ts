/*
* sessionHandler
* descr: create session handler for http
* scope: only server
* dependencies: sessionInfo
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.5
*/

import { RequestHandler, Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import { TSessions, TSession } from './sessionInfo';

class TOptions {
    cryptoSize: number;
    maxAge: number;
    appName: string;
    filename: string;
    constructor() {
        this.cryptoSize = 20,
        this.maxAge = 900000,
        this.appName = '',
        this.filename = ''
    }
}

/** Session Manager App */
export class TSessionApp{

    private _options: any;
    private _sessions: TSessions;

    constructor(options?: any){
        // assign options
        this._options = new TOptions;
        for (const i in options) {
            this._options[i] = options[i];
        }
        // create sessions
        this._sessions = new TSessions;
        // load sessions to file
        if (this._options.filename) {
            this._sessions.load(this._options.filename);
        }
    }

    /** get session handler middleware */
    get handler(): RequestHandler {
        return this._handler.bind(this);
    }

    /** get session function */
    get session(){
        return this._getSession.bind(this);
    }

    /** create a logged session and returns session */
    public createSession(req: any, res: any, data: any): TSession {
        // get cookies from user or create it if not exists
        var sessionid = this._getCookie(req, res, this._options.appName);
        // get session of user and create token and assigns data
        var session = this._findSession(sessionid);
        session.tokenid = crypto.randomBytes(this._options.cryptoSize).toString('hex');
        session.data = data;
        // save sessions to file
        if (this._options.filename) {
            this._sessions.save(this._options.filename);
        }
        return session;
    }

    /** destroy a logged session */
    public destroySession(req: any, res: any): boolean{
        // get cookies from user or create it if not exists
        var sessionid = this._getCookie(req, res, this._options.appName);
        // get session of user and create token and assigns data
        var session: TSession = this._findSession(sessionid);
        // check if user send token
        var tokenid = req.get('tokenid');
        if (session.tokenid === tokenid && tokenid) {
            // authenticated session route
            session.clear();
            return true;
        } else {
            // not authenticated
            return false;
        }
    }

    /** get session content */
    private _getSession(req: any, res: any){
        // get cookies from user or create it if not exists
        var sessionid = this._getCookie(req, res, this._options.appName);
        // get session of user
        var session = this._findSession(sessionid);
        // check if user send token
        var tokenid = req.get('tokenid');
        if (session.tokenid === tokenid && tokenid != '') {
            // authenticated session route
            req.session = session;
        } else {
            // not authenticated
            req.session = false;
        }
        // save sessions to file
        if (this._options.filename) {
            this._sessions.save(this._options.filename);
        }
    }

    private _handler(req: Request, res: Response, next: NextFunction){
        this._getSession(req,res);
        next();
    }

    /** get cookie or create it */
    private _getCookie(req: any, res: any, appName: string) {
        var sessionid = req.cookies[appName];
        if (!sessionid) {
            sessionid = crypto.randomBytes(this._options.cryptoSize).toString('hex');
            res.cookie(appName, sessionid, {
                maxAge: this._options.maxAge,
                httpOnly: true
            });
        }
        return sessionid;
    }

    /** find user */
    private _findSession(sessionid: string): TSession {
        var session: TSession = this._sessions.find(sessionid);
        if (!session) {
            session = this._sessions.add(sessionid);
        }
        return session;
    }

    private _saveSessionToFile(filename: string) {
        this._sessions.save(filename);
    }
}
