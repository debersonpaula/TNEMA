/// <reference types="express" />
import { TObject } from 'tobjectlist';
import { THttpServer } from './httpServer';
import { TSchema, TMongoServer } from './mongoServer';
import { RequestHandler } from 'express';
import { TSessionApp } from './sessionHandler';
declare class TAuthServer extends TObject {
    private _HttpServer;
    private _MongoServer;
    private _session;
    private _schemas;
    private _options;
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer, SessionID: string, SessionFile: string);
    readonly Session: TSessionApp;
    Create(fn?: Function): void;
    Destroy(fn?: Function): void;
    OverwriteSchemas(schemas: TSchema[]): void;
    OverwriteOptions(options: any): void;
    private InitStandardModels();
    private setLogin(req, res);
    private setRegister(req, res);
    private getSessionData(source);
    private InitRoutes();
    private _authRoute(req, res, next);
    /** Auth Route Middleware */
    readonly AuthRoute: RequestHandler;
}
export { TAuthServer };
